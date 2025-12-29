import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useEvents } from '@/contexts/EventContext';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { toast } from 'sonner';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ArrowLeft, 
  Edit, 
  Trash2, 
  UserPlus, 
  UserMinus,
  Share2
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEventById, rsvpToEvent, cancelRsvp, deleteEvent } = useEvents();
  const { user, isAuthenticated } = useAuth();

  const event = getEventById(id || '');

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-heading text-2xl font-bold text-foreground mb-4">
              Event Not Found
            </h1>
            <Link to="/events">
              <Button>Back to Events</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const spotsLeft = event.capacity - event.attendees.length;
  const isCreator = user?.id === event.creatorId;
  const hasRsvp = user ? event.attendees.includes(user.id) : false;
  const isFull = spotsLeft === 0;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleRsvp = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to RSVP');
      navigate('/login');
      return;
    }

    if (!user) return;

    const result = rsvpToEvent(event.id, user.id);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleCancelRsvp = () => {
    if (!user) return;
    cancelRsvp(event.id, user.id);
    toast.success('RSVP cancelled successfully');
  };

  const handleDelete = () => {
    deleteEvent(event.id);
    toast.success('Event deleted successfully');
    navigate('/events');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Image */}
        <div className="relative h-64 md:h-96 overflow-hidden">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="container mx-auto">
              <Badge className="gradient-primary border-0 mb-4">{event.category}</Badge>
              <h1 className="font-heading text-3xl md:text-5xl font-bold text-primary-foreground mb-2">
                {event.title}
              </h1>
              <p className="text-primary-foreground/80">by {event.creatorName}</p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => navigate('/events')} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
                    About This Event
                  </h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {event.description}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
                    Event Details
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{formatDate(event.date)}</p>
                        <p className="text-sm text-muted-foreground">Date</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{event.time}</p>
                        <p className="text-sm text-muted-foreground">Time</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{event.location}</p>
                        <p className="text-sm text-muted-foreground">Location</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  {/* Capacity */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Capacity</span>
                      <span className="text-sm font-medium text-foreground">
                        {event.attendees.length} / {event.capacity}
                      </span>
                    </div>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full gradient-primary transition-all duration-300"
                        style={{ width: `${(event.attendees.length / event.capacity) * 100}%` }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {spotsLeft > 0 ? (
                        <span className={spotsLeft <= 5 ? 'text-warning' : ''}>
                          {spotsLeft} spots remaining
                        </span>
                      ) : (
                        <span className="text-destructive">Event is full</span>
                      )}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    {isCreator ? (
                      <>
                        <Link to={`/events/${event.id}/edit`} className="block">
                          <Button className="w-full gradient-primary">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Event
                          </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="w-full">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Event
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Event</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this event? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDelete}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    ) : hasRsvp ? (
                      <Button
                        variant="outline"
                        className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={handleCancelRsvp}
                      >
                        <UserMinus className="w-4 h-4 mr-2" />
                        Cancel RSVP
                      </Button>
                    ) : (
                      <Button
                        className="w-full gradient-primary"
                        onClick={handleRsvp}
                        disabled={isFull}
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        {isFull ? 'Event Full' : 'RSVP Now'}
                      </Button>
                    )}
                    
                    <Button variant="outline" className="w-full" onClick={handleShare}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Event
                    </Button>
                  </div>

                  {/* Attendees preview */}
                  {event.attendees.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-border">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{event.attendees.length} people attending</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EventDetail;
