import { useState, useEffect, useRef } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Phone, Video, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { ZIM } from "zego-zim-web";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/auth/AuthProvider";
import api from "@/utils/api";
import { doctorProfileProps } from "@/lib/user.type";
// Types
interface Doctor {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  status: "available" | "busy" | "offline";
}
interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
}
function randomID(len: number) {
  let result = "";
  const chars =
    "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP";
  const maxPos = chars.length;
  len = len || 5;
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}
const FixChat = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isVideoCall, setIsVideoCall] = useState(false);
  const { toast } = useToast();
  const { currentUser, currentDoctor, userType } = useAuth();
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [zegoCloud, setZegoCloud] = useState<any>(null);
  // Fetch available doctors
  const { data: doctorsData } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const { data } = await api.get("/doctors/available");
      console.log(data);

      return data;
    },
    enabled: userType === "user",
  });
  useEffect(() => {
    const initZegoCloud = async () => {
      const appID = 263201994; // Replace with your ZegoCloud App ID
      const serverSecret = "6bb43443414d42bd8b1ae4a008f3e721"; // Replace with your Server Secret

      const userID = currentDoctor?._id || currentUser?._id || randomID(5);
      const userName = currentDoctor
        ? `${currentDoctor.firstName} ${currentDoctor.lastName}`
        : currentUser
        ? `${currentUser.firstName} ${currentUser.lastName}`
        : `User_${randomID(5)}`;
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        null,
        userID,
        userName
      );
      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.addPlugins({ ZIM });
      // Set up call invitation handlers
      zp.setCallInvitationConfig({
        onIncomingCallReceived: (callID, caller) => {
          toast({
            title: "Incoming Call",
            description: `${caller.userName} is calling...`,
            duration: 30000,
          });
        },
        onIncomingCallCanceled: (callID, caller) => {
          toast({
            title: "Call Canceled",
            description: `${caller.userName} canceled the call`,
          });
        },
        onOutgoingCallAccepted: (callID, callee) => {
          toast({
            title: "Call Accepted",
            description: `${callee.userName} accepted the call`,
          });
        },
        onOutgoingCallRejected: (callID, callee) => {
          toast({
            title: "Call Rejected",
            description: `${callee.userName} rejected the call`,
          });
        },
      });
      setZegoCloud(zp);
    };
    if (currentUser || currentDoctor) {
      initZegoCloud();
    }
    return () => {
      if (zegoCloud) {
        zegoCloud.destroy();
      }
    };
  }, [currentUser, currentDoctor]);
  const startVideoCall = async () => {
    if (!selectedDoctor || !zegoCloud) return;
    const roomID = `room_${randomID(5)}`;

    try {
      await zegoCloud.sendCallInvitation({
        callees: [
          {
            userID: selectedDoctor.id,
            userName: selectedDoctor.name,
          },
        ],
        callType: ZegoUIKitPrebuilt.InvitationTypeVideoCall,
        timeout: 60,
      });
      if (videoContainerRef.current) {
        zegoCloud.joinRoom({
          container: videoContainerRef.current,
          sharedLinks: [
            {
              name: "Copy Link",
              url: `${window.location.origin}/room?roomID=${roomID}`,
            },
          ],
          scenario: {
            mode: ZegoUIKitPrebuilt.OneONoneCall,
          },
          showPreJoinView: false,
        });
      }
      setIsVideoCall(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start video call",
        variant: "destructive",
      });
    }
  };
  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      const message: Message = {
        id: randomID(5),
        text: newMessage,
        sender: "You", // Replace with actual sender info
        timestamp: new Date(),
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };
  const doctors = doctorsData?.data?.data || [];
  const handleSelectDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
  };
  if (userType === "doctor") {
    return (
      <MainLayout>
        <Card>
          <CardHeader>
            <CardTitle>Patient Chat</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              You can communicate with your patients here. Select a patient to
              start chatting.
            </p>
          </CardContent>
        </Card>
      </MainLayout>
    );
  }
  return (
    <MainLayout>
      <div className="grid grid-cols-4 gap-4">
        {/* Doctor List */}
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Available Doctors</CardTitle>
            </CardHeader>
            <CardContent className="h-[70vh]">
              <ScrollArea className="h-full">
                <div className="space-y-4">
                  {doctorsData?.data?.map((doctor: doctorProfileProps) => (
                    <div
                      key={doctor._id}
                      className="flex items-center space-x-4 rounded-md border p-2 hover:bg-secondary/50"
                      onClick={() =>
                        handleSelectDoctor({
                          id: doctor._id,
                          name: `${doctor.firstName} ${doctor.lastName}`,
                          specialty: doctor.specialization,
                          avatar: `https://i.pravatar.cc/150?img=${doctor._id}`,
                          status: doctor.isOnline ? "available" : "offline",
                        })
                      }
                    >
                      <Avatar>
                        <AvatarImage
                          src={`https://i.pravatar.cc/150?img=${doctor._id}`}
                          alt={doctor.firstName}
                        />
                        <AvatarFallback>
                          {doctor.firstName[0]}
                          {doctor.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">
                          {doctor.firstName} {doctor.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {doctor.specialization}
                        </p>
                        {doctor.isOnline ? (
                          <Badge variant="secondary">Available</Badge>
                        ) : (
                          <Badge variant="outline">Offline</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        {/* Chat Interface */}
        <div className="col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedDoctor ? `Chat with ${selectedDoctor.name}` : "Chat"}
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[70vh] flex flex-col">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex flex-col ${
                        message.sender === "You" ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`rounded-lg px-4 py-2 ${
                          message.sender === "You"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {message.text}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {message.sender} -{" "}
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="mt-4 flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <Button onClick={handleSendMessage}>
                  Send <Send className="ml-2 h-4 w-4" />
                </Button>
                {selectedDoctor && (
                  <Button onClick={startVideoCall}>
                    <Video className="mr-2 h-4 w-4" />
                    Video Call
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Video Call Dialog */}
      <Dialog open={isVideoCall} onOpenChange={setIsVideoCall}>
        <DialogContent className="h-[80vh] max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Video Call with {selectedDoctor?.name}</span>
              <Button
                variant="destructive"
                onClick={() => setIsVideoCall(false)}
              >
                End Call
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div ref={videoContainerRef} className="h-full w-full" />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};
export default FixChat;
