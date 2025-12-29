import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEvents } from '@/contexts/EventContext';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { toast } from 'sonner';
import { Upload, X, Loader2, Sparkles } from 'lucide-react';

const categories = [
  'Technology',
  'Music',
  'Business',
  'Health',
  'Art',
  'Food',
  'Sports',
  'Education',
];

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const { addEvent } = useEvents();
  const { user, isAuthenticated } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    capacity: '',
    category: '',
    imageUrl: '',
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        // In a real app, you'd upload to a server and get a URL back
        setFormData((prev) => ({ ...prev, imageUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setFormData((prev) => ({ ...prev, imageUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const generateAIDescription = async () => {
    if (!formData.title) {
      toast.error('Please enter an event title first');
      return;
    }

    setIsGeneratingAI(true);
    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const generatedDescriptions: Record<string, string> = {
      Technology: `Join us for ${formData.title}! This cutting-edge technology event brings together innovators, developers, and tech enthusiasts. Experience hands-on workshops, insightful keynotes, and networking opportunities that will shape the future of technology. Whether you're a seasoned professional or just starting your tech journey, this event offers valuable insights and connections.`,
      Music: `Get ready for an unforgettable musical experience at ${formData.title}! Immerse yourself in an evening of exceptional performances, featuring talented artists who will captivate your senses. From soulful melodies to energetic beats, this event promises to create memories that last a lifetime. Come celebrate the universal language of music with fellow enthusiasts.`,
      Business: `${formData.title} is your gateway to business excellence! Network with industry leaders, gain actionable insights from expert speakers, and discover strategies to accelerate your professional growth. This premier business event is designed for entrepreneurs, executives, and professionals seeking to stay ahead in today's competitive landscape.`,
      Health: `Transform your wellness journey at ${formData.title}! This holistic health event offers expert-led sessions on nutrition, fitness, and mental well-being. Connect with health professionals, discover the latest wellness trends, and take the first step toward a healthier, more balanced lifestyle. All skill levels welcome.`,
      Art: `Experience creativity unleashed at ${formData.title}! This artistic gathering celebrates visual expression in all its forms. Explore stunning exhibits, meet passionate artists, and immerse yourself in a world of color, form, and imagination. Whether you're an art lover or creator, this event will inspire and delight.`,
      Food: `Indulge your taste buds at ${formData.title}! This culinary celebration brings together food lovers, chefs, and gastronomic adventures. Sample exquisite dishes, learn cooking techniques, and discover new flavors from around the world. A feast for all the senses awaits!`,
      Sports: `Get in the game at ${formData.title}! This exciting sports event brings together athletes, fans, and fitness enthusiasts for an action-packed experience. Whether you're competing or cheering, feel the energy and camaraderie that makes sports unforgettable.`,
      Education: `Expand your horizons at ${formData.title}! This educational event offers engaging workshops, thought-provoking discussions, and opportunities for lifelong learning. Connect with educators, researchers, and curious minds in a collaborative environment designed to inspire growth and discovery.`,
    };

    const description = generatedDescriptions[formData.category] || 
      `Join us for ${formData.title}! This exciting event promises to deliver an exceptional experience with engaging activities, networking opportunities, and memorable moments. Don't miss your chance to be part of something special. Reserve your spot today and prepare for an unforgettable event!`;

    setFormData((prev) => ({ ...prev, description }));
    setIsGeneratingAI(false);
    toast.success('AI description generated!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.date || 
        !formData.time || !formData.location || !formData.capacity || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.imageUrl) {
      toast.error('Please upload an event image');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      addEvent({
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        capacity: parseInt(formData.capacity),
        imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        category: formData.category,
        creatorId: user!.id,
        creatorName: user!.name,
      });

      toast.success('Event created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to create event');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-border/50">
            <CardHeader>
              <CardTitle className="font-heading text-2xl">Create New Event</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div className="space-y-2">
                  <Label>Event Image *</Label>
                  {previewImage ? (
                    <div className="relative rounded-xl overflow-hidden">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 p-1 rounded-full bg-destructive text-destructive-foreground hover:opacity-90"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-colors"
                    >
                      <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">
                        Click to upload event image
                      </p>
                      <p className="text-sm text-muted-foreground/60 mt-1">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter event title"
                    className="h-12"
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={formData.category} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Description with AI */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="description">Description *</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={generateAIDescription}
                      disabled={isGeneratingAI}
                      className="text-primary"
                    >
                      {isGeneratingAI ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          AI Generate
                        </>
                      )}
                    </Button>
                  </div>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your event..."
                    rows={5}
                  />
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time *</Label>
                    <Input
                      id="time"
                      name="time"
                      type="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="h-12"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter event location"
                    className="h-12"
                  />
                </div>

                {/* Capacity */}
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity *</Label>
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={handleChange}
                    placeholder="Maximum attendees"
                    className="h-12"
                  />
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full h-12 gradient-primary hover:opacity-90 transition-opacity"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creating Event...
                    </>
                  ) : (
                    'Create Event'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateEvent;
