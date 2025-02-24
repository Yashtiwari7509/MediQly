import { useState, useEffect } from "react";
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
import MainLayout from "@/components/layout/MainLayout";

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

const mockDoctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    avatar: "https://i.pravatar.cc/150?u=1",
    status: "available",
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialty: "Pediatrician",
    avatar: "https://i.pravatar.cc/150?u=2",
    status: "available",
  },
  {
    id: "3",
    name: "Dr. Emily Williams",
    specialty: "Dermatologist",
    avatar: "https://i.pravatar.cc/150?u=3",
    status: "busy",
  },
];

const ChatCall = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isVideoCall, setIsVideoCall] = useState(false);
  const { toast } = useToast();

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

  const startVideoCall = () => {
    setIsVideoCall(true);
    toast({
      title: "Starting video call",
      description: "Connecting to doctor...",
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
                {mockDoctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className={`flex cursor-pointer items-center gap-3 border-b p-4 transition-colors hover:bg-accent ${
                      selectedDoctor?.id === doctor.id ? "bg-accent" : ""
                    }`}
                    onClick={() => setSelectedDoctor(doctor)}
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={doctor.avatar} />
                        <AvatarFallback>{doctor.name[0]}</AvatarFallback>
                      </Avatar>
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background ${
                          doctor.status === "available"
                            ? "bg-green-500"
                            : doctor.status === "busy"
                            ? "bg-yellow-500"
                            : "bg-gray-500"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{doctor.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {doctor.specialty}
                      </p>
                    </div>
                    <Badge
                      variant={doctor.status === "available" ? "default" : "secondary"}
                    >
                      {doctor.status}
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
                        <AvatarFallback>{selectedDoctor.name[0]}</AvatarFallback>
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
                            message.sender === "user" ? "justify-end" : "justify-start"
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
                <span>
                  Video Call with {selectedDoctor?.name}
                </span>
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