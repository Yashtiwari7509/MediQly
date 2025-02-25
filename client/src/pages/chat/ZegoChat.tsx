import { useState } from "react";
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
import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";
import { useAuth } from "@/auth/AuthProvider";
import { doctorProfileProps } from "@/lib/user.type";

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

const Chat = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isVideoCall, setIsVideoCall] = useState(false);
  const { toast } = useToast();
  const { userType, currentDoctor, currentUser } = useAuth();

  const { data: doctors = [] } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const { data } = await api.get("/doctors/available");
      console.log(data);

      return data;
    },
    enabled: userType === "user",
  });
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, message]);
    setNewMessage("");

    // Simulate doctor response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for your message. How can I help you today?",
        sender: "doctor",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, response]);
    }, 1000);
  };

  const startVideoCall = async () => {
    if (!selectedDoctor) return;

    setIsVideoCall(true);
    toast({
      title: "Starting video call",
      description: "Connecting to doctor...",
    });

    const appID = 263201994; // Replace with your ZegoCloud App ID
    const serverSecret = "6bb43443414d42bd8b1ae4a008f3e721"; // Replace with your Server Secret
    const roomID = `doctor-${selectedDoctor.id}`;
    console.log(roomID);
    
    const userID = Date.now().toString();
    const userName = "Patient";

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      userID,
      userName
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);

    zp.joinRoom({
      container: document.querySelector("#video-container")!,
      sharedLinks: [
        {
          name: "Join via link",
          url: window.location.origin + "/room/" + roomID,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      showPreJoinView: false,
    });
  };

  const endVideoCall = () => {
    setIsVideoCall(false);
    toast({
      title: "Call ended",
      description: "Video call has ended",
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto animate-in">
        <h1 className="mb-6 text-2xl font-bold">Chat with Doctors</h1>

        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
          {/* Doctors List */}
          <Card className="h-[calc(100vh-200px)]">
            <CardHeader>
              <CardTitle>Available Doctors</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-280px)]">
                {doctors.data?.map((doctor: doctorProfileProps) => (
                  <div
                    key={doctor._id}
                    className={`flex cursor-pointer items-center gap-3 border-b p-4 transition-colors hover:bg-accent ${
                      selectedDoctor?.id === doctor._id ? "bg-accent" : ""
                    }`}
                    onClick={() =>
                      setSelectedDoctor({
                        id: doctor._id,
                        name: `${doctor.firstName} ${doctor.lastName}`,
                        specialty: doctor.specialization,
                        avatar: doctor.firstName.charAt(0),
                        status: doctor.isOnline ? "available" : "offline",
                      })
                    }
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <Avatar />
                      </Avatar>
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background ${
                          doctor.isOnline === true
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {doctor.firstName}
                        {doctor.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {doctor.specialization}
                      </p>
                    </div>
                    <Badge
                      variant={
                        doctor.isOnline === true ? "default" : "secondary"
                      }
                    >
                      {doctor.isOnline === true ? "Online" : "Offline"}
                    </Badge>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="h-[calc(100vh-200px)]">
            {selectedDoctor ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={selectedDoctor.avatar} />
                        <AvatarFallback>
                          {selectedDoctor.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{selectedDoctor.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {selectedDoctor.specialty}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          toast({
                            title: "Starting call",
                            description: "Connecting to doctor...",
                          });
                        }}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={startVideoCall}
                      >
                        <Video className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex h-[calc(100%-160px)] flex-col justify-between p-0">
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`rounded-lg px-4 py-2 ${
                              message.sender === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <p>{message.text}</p>
                            <p className="mt-1 text-xs opacity-70">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="border-t p-4">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMessage();
                      }}
                      className="flex gap-2"
                    >
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />
                      <Button type="submit">
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex h-full items-center justify-center text-muted-foreground">
                Select a doctor to start chatting
              </CardContent>
            )}
          </Card>
        </div>

        {/* Video Call Dialog */}
        <Dialog open={isVideoCall} onOpenChange={setIsVideoCall}>
          <DialogContent className="h-[80vh] max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Video Call with {selectedDoctor?.name}</span>
                <Button variant="destructive" onClick={endVideoCall}>
                  End Call
                </Button>
              </DialogTitle>
            </DialogHeader>
            <div id="video-container" className="h-full w-full">
              <div className="text-center">
                <p className="text-muted-foreground">Connecting to doctor...</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Chat;
