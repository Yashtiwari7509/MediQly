import { useState, useEffect } from "react";
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
import { doctorProfileProps, profileProps } from "@/lib/user.type";

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

const ChatCall = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isVideoCall, setIsVideoCall] = useState(false);
  const { toast } = useToast();
  const { currentUser, currentDoctor, userType } = useAuth();

  // Fetch available doctors
  const { data } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const { data } = await api.get("/doctors/available");
      console.log(data);

      return data;
    },
    enabled: userType === "user",
  });

  // Handle incoming call notifications for doctors
  useEffect(() => {
    if (userType !== "doctor" || !currentDoctor) return;

    // Listen for incoming calls
    const handleIncomingCall = async (roomID: string, patientName: string) => {
      const shouldAccept = window.confirm(
        `Incoming call from patient ${patientName}. Accept?`
      );

      if (shouldAccept) {
        await joinVideoCall(roomID, currentDoctor.firstName);
      } else {
        // Notify patient that call was declined
        await api.post("/notifications/decline-call", { roomID });
      }
    };

    // Set up WebSocket or Server-Sent Events for real-time notifications
    const eventSource = new EventSource("/api/notifications");
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "incoming_call") {
        handleIncomingCall(data.roomID, data.patientName);
      }
    };

    return () => {
      eventSource.close();
    };
  }, [currentDoctor, userType]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedDoctor) return;

    try {
      // Send message to backend
      await api.post("/messages/send", {
        doctorId: selectedDoctor.id,
        message: newMessage,
      });

      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages([...messages, message]);
      setNewMessage("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const joinVideoCall = async (roomID: string, userName: string) => {
    const appID = 0; // Replace with your ZegoCloud App ID
    const serverSecret = "your-server-secret"; // Replace with your Server Secret
    const userID = Date.now().toString();

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      userID,
      userName
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);

    // Join the video call room
    await zp.joinRoom({
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
      onJoinRoom: () => {
        setIsVideoCall(true);
      },
      onLeaveRoom: () => {
        setIsVideoCall(false);
      },
    });
  };
  useEffect(() => {
    // console.log(doctors);
  }, []);

  const startVideoCall = async () => {
    if (!selectedDoctor || !currentUser) return;

    try {
      // Notify backend about the call request
      await api.post("/notifications/call-request", {
        doctorId: selectedDoctor.id,
        roomID: `doctor-${selectedDoctor.id}`,
        patientName: currentUser.firstName + currentUser.lastName,
      });

      // Join the video call room
      await joinVideoCall(`doctor-${selectedDoctor.id}`, currentUser.firstName);

      toast({
        title: "Starting video call",
        description: "Connecting to doctor...",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start video call",
        variant: "destructive",
      });
    }
  };

  const endVideoCall = () => {
    setIsVideoCall(false);
    toast({
      title: "Call ended",
      description: "Video call has ended",
    });
  };

  // Show doctor interface if the current user is a doctor
  if (userType === "doctor" && currentDoctor) {
    return (
      <MainLayout>
        <div className="container mx-auto animate-in">
          <h1 className="mb-6 text-2xl font-bold">Doctor's Dashboard</h1>
          <Card>
            <CardHeader>
              <CardTitle>Your Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={""} />
                  <AvatarFallback>{currentDoctor.firstName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-semibold">
                    {currentDoctor.firstName} {currentDoctor.lastName}
                  </h2>
                  <p className="text-muted-foreground">
                    {currentDoctor.specialization}
                  </p>
                </div>
                <Badge className="ml-auto">Available</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }
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
                {data?.data.map((doctor : doctorProfileProps) => (
                  <div
                    key={doctor._id
                    }
                    className={`flex cursor-pointer items-center gap-3 border-b p-4 transition-colors hover:bg-accent ${
                      selectedDoctor?.id === doctor._id ? "bg-accent" : ""
                    }`}
                    onClick={() => setSelectedDoctor({
                      id: doctor._id,
                      name: `${doctor.firstName} ${doctor.lastName}`,
                      specialty: doctor.specialization,
                      avatar: doctor.firstName.charAt(0),
                      status: doctor.isOnline ? "available" : "offline"
                    })}
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={''} />
                        <AvatarFallback>{doctor.firstName[0]}</AvatarFallback>
                      </Avatar>
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background ${
                          doctor.isOnline === true
                            ? "bg-green-500"
                            : doctor.isOnline === false
                            ? "bg-yellow-500"
                            : "bg-gray-500"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{doctor.firstName}</p>
                      <p className="text-sm text-muted-foreground">
                        {doctor.specialization}
                      </p>
                    </div>
                    <Badge
                      variant={
                        doctor.isOnline === true ? "default" : "secondary"
                      }
                    >
                      {doctor.isOnline === true ? "Available" : "Offline"}
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
                      {messages?.map((message) => (
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
            <div className="relative flex h-full items-center justify-center rounded-lg bg-muted">
              <div className="absolute bottom-4 right-4 h-32 w-48 overflow-hidden rounded-lg bg-background shadow-lg">
                <video
                  className="h-full w-full object-cover"
                  src="https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-video-call-6762-large.mp4"
                  autoPlay
                  loop
                  muted
                />
              </div>
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

export default ChatCall;
