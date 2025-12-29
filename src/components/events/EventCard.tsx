import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Event } from '@/contexts/EventContext';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const spotsLeft = event.capacity - event.attendees.length;
  const isAlmostFull = spotsLeft <= 5 && spotsLeft > 0;
  const isFull = spotsLeft === 0;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        
        {/* Category Badge */}
        <Badge className="absolute top-3 left-3 gradient-primary border-0">
          {event.category}
        </Badge>

        {/* Capacity Badge */}
        {isFull ? (
          <Badge variant="destructive" className="absolute top-3 right-3">
            Sold Out
          </Badge>
        ) : isAlmostFull ? (
          <Badge className="absolute top-3 right-3 bg-warning text-warning-foreground border-0">
            {spotsLeft} spots left
          </Badge>
        ) : null}
      </div>

      <CardContent className="p-5">
        {/* Title */}
        <h3 className="font-heading font-semibold text-lg text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        {/* Meta Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{formatDate(event.date)}</span>
            <Clock className="w-4 h-4 text-primary ml-2" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4 text-primary" />
            <span>{event.attendees.length} / {event.capacity} attending</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Link to={`/events/${event.id}`} className="w-full">
          <Button 
            className="w-full gradient-primary hover:opacity-90 transition-opacity" 
            disabled={isFull}
          >
            {isFull ? 'Event Full' : 'View Details'}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
