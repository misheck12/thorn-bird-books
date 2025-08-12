import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper,
  Skeleton,
  Alert,
  Avatar,
  Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Event as EventIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { eventService } from '../services/events';
import { useAuthStore } from '../store';
import { Event } from '../types';
import { toast } from 'react-toastify';

const Events: React.FC = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    search: '',
    type: '',
    city: '',
    isFree: undefined as boolean | undefined,
  });

  const { isAuthenticated } = useAuthStore();

  // Fetch events with current filters
  const {
    data: eventsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['events', filters],
    queryFn: () => eventService.getAllEvents(filters),
  });

  const handleFilterChange = (filterName: string, value: any) => {
    setFilters({
      ...filters,
      [filterName]: value,
      page: 1,
    });
  };

  const handleRegisterForEvent = async (event: Event) => {
    if (!isAuthenticated) {
      toast.error('Please login to register for events');
      return;
    }

    try {
      await eventService.registerForEvent(event._id);
      toast.success(`Successfully registered for ${event.title}!`);
      refetch(); // Refresh the events list
    } catch (error: any) {
      toast.error(error.message || 'Failed to register for event');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const time = new Date();
    time.setHours(parseInt(hours), parseInt(minutes));
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'book_signing':
        return 'primary';
      case 'reading':
        return 'secondary';
      case 'workshop':
        return 'success';
      case 'discussion':
        return 'info';
      case 'launch':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getEventTypeIcon = (type: string) => {
    return <EventIcon />;
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      search: '',
      type: '',
      city: '',
      isFree: undefined,
    });
  };

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          Failed to load events. Please try again later.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          Literary Events
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Join our community for readings, workshops, book launches, and more
        </Typography>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <FilterIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Find Events</Typography>
        </Box>
        
        <Grid container spacing={2} alignItems="center">
          {/* Search */}
          <Grid xs={12} md={4}>
            <TextField
              fullWidth
              label="Search events..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
              }}
            />
          </Grid>

          {/* Event Type Filter */}
          <Grid xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Event Type</InputLabel>
              <Select
                value={filters.type}
                label="Event Type"
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="book_signing">Book Signing</MenuItem>
                <MenuItem value="reading">Reading</MenuItem>
                <MenuItem value="workshop">Workshop</MenuItem>
                <MenuItem value="discussion">Discussion</MenuItem>
                <MenuItem value="launch">Book Launch</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* City Filter */}
          <Grid xs={12} md={2}>
            <TextField
              fullWidth
              label="City"
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
            />
          </Grid>

          {/* Free/Paid Filter */}
          <Grid xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Price</InputLabel>
              <Select
                value={filters.isFree === undefined ? '' : filters.isFree ? 'free' : 'paid'}
                label="Price"
                onChange={(e) => {
                  const value = e.target.value;
                  handleFilterChange('isFree', value === '' ? undefined : (value === 'free'));
                }}
              >
                <MenuItem value="">All Events</MenuItem>
                <MenuItem value="free">Free Events</MenuItem>
                <MenuItem value="paid">Paid Events</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Clear Filters */}
          <Grid xs={12} md={2}>
            <Button
              variant="outlined"
              fullWidth
              onClick={clearFilters}
              disabled={!filters.search && !filters.type && !filters.city && filters.isFree === undefined}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Results Info */}
      {eventsData && (
        <Box mb={2}>
          <Typography variant="body2" color="text.secondary">
            Showing {eventsData.events.length} of {eventsData.pagination?.total || 0} events
          </Typography>
        </Box>
      )}

      {/* Events Grid */}
      <Grid container spacing={3}>
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, index) => (
            <Grid xs={12} md={6} lg={4} key={index}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" height={40} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="rectangular" height={80} sx={{ mt: 2 }} />
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : eventsData?.events.length === 0 ? (
          <Grid xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <EventIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No events found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your filters or check back later for new events
              </Typography>
            </Paper>
          </Grid>
        ) : (
          eventsData?.events.map((event) => (
            <Grid xs={12} md={6} lg={4} key={event._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {event.featuredImage && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={event.featuredImage}
                    alt={event.title}
                    sx={{ objectFit: 'cover' }}
                  />
                )}
                
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <Chip
                      icon={getEventTypeIcon(event.type)}
                      label={event.type.replace('_', ' ').toUpperCase()}
                      color={getEventTypeColor(event.type) as any}
                      size="small"
                    />
                    {event.isFree && (
                      <Chip label="FREE" color="success" size="small" />
                    )}
                  </Box>

                  <Typography variant="h6" component="h2" gutterBottom>
                    {event.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {event.description.length > 150
                      ? `${event.description.substring(0, 150)}...`
                      : event.description}
                  </Typography>

                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <TimeIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {formatDate(event.date)}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <TimeIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {formatTime(event.startTime)} - {formatTime(event.endTime)}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <LocationIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {event.location.name}, {event.location.city}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <PersonIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {event.registeredCount}/{event.capacity} registered
                    </Typography>
                  </Box>

                  {!event.isFree && (
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <MoneyIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        ${event.price}
                      </Typography>
                    </Box>
                  )}

                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar sx={{ width: 24, height: 24 }} />
                    <Typography variant="body2" color="text.secondary">
                      Organized by {event.organizer}
                    </Typography>
                  </Box>
                </CardContent>

                <Divider />

                <CardActions sx={{ p: 2 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleRegisterForEvent(event)}
                    disabled={event.registeredCount >= event.capacity}
                  >
                    {event.registeredCount >= event.capacity ? 'Event Full' : 'Register'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default Events;