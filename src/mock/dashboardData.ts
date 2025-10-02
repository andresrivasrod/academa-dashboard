
// Sample dashboard data for visualization purposes

// Generate dates for the past 30 days
const generateDates = (days: number) => {
  return Array.from({ length: days }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    return date.toISOString().split('T')[0];
  });
};

const dates = generateDates(30);

// Dashboard metrics
export const overviewMetrics = {
  totalUsers: 12584,
  newSignups: 342,
  totalClasses: 487,
  activeUsers: 8745,
  totalWatchTime: 42871, // hours
  totalIncidents: 23
};

// Daily signups data
export const dailySignups = dates.map(date => ({
  date,
  count: Math.floor(Math.random() * 35) + 5
}));

// User activity data
export const userActivity = dates.map(date => ({
  date,
  activeUsers: Math.floor(Math.random() * 600) + 200,
  classViews: Math.floor(Math.random() * 1200) + 800,
  watchTime: Math.floor(Math.random() * 800) + 400,
}));

// User demographics
export const userAgeGroups = [
  { age: '13-17', count: 1245 },
  { age: '18-24', count: 4583 },
  { age: '25-34', count: 3897 },
  { age: '35-44', count: 1856 },
  { age: '45-54', count: 678 },
  { age: '55+', count: 325 }
];

export const userGender = [
  { gender: 'Male', count: 5843 },
  { gender: 'Female', count: 6412 },
  { gender: 'Other/Prefer not to say', count: 329 }
];

// Top classes
export const topClasses = [
  { id: 1, title: 'Advanced Yoga Flow', teacher: 'Sarah Johnson', views: 4587, likes: 3254, watchTime: 2341, favorites: 987 },
  { id: 2, title: 'HIIT Cardio Blast', teacher: 'Alex Rodriguez', views: 4123, likes: 2876, watchTime: 1987, favorites: 876 },
  { id: 3, title: 'Mindfulness Meditation', teacher: 'David Chen', views: 3982, likes: 3102, watchTime: 3245, favorites: 1432 },
  { id: 4, title: 'Ballet Fundamentals', teacher: 'Emma Williams', views: 3756, likes: 2543, watchTime: 2876, favorites: 654 },
  { id: 5, title: 'Power Pilates', teacher: 'Olivia Martinez', views: 3421, likes: 2345, watchTime: 1765, favorites: 587 },
  { id: 6, title: 'Beginner Strength Training', teacher: 'James Wilson', views: 3245, likes: 2134, watchTime: 1987, favorites: 432 },
  { id: 7, title: 'Jazz Dance Basics', teacher: 'Sophia Kim', views: 2987, likes: 1876, watchTime: 1432, favorites: 345 },
  { id: 8, title: 'Vinyasa Yoga', teacher: 'Sarah Johnson', views: 2876, likes: 2143, watchTime: 1876, favorites: 598 }
];

// Top teachers
export const topTeachers = [
  { id: 1, name: 'Sarah Johnson', specialty: 'Yoga', classCount: 24, totalViews: 7463, averageRating: 4.8 },
  { id: 2, name: 'Alex Rodriguez', specialty: 'HIIT & Cardio', classCount: 18, totalViews: 6532, averageRating: 4.7 },
  { id: 3, name: 'David Chen', specialty: 'Meditation', classCount: 15, totalViews: 5876, averageRating: 4.9 },
  { id: 4, name: 'Emma Williams', specialty: 'Ballet', classCount: 21, totalViews: 5324, averageRating: 4.6 },
  { id: 5, name: 'Olivia Martinez', specialty: 'Pilates', classCount: 19, totalViews: 4987, averageRating: 4.5 },
  { id: 6, name: 'James Wilson', specialty: 'Strength Training', classCount: 16, totalViews: 4532, averageRating: 4.4 },
  { id: 7, name: 'Sophia Kim', specialty: 'Dance', classCount: 22, totalViews: 4231, averageRating: 4.7 }
];

// Incidents
export const incidents = [
  { id: 1, date: dates[29], type: 'Technical', description: 'Video streaming service outage', status: 'Resolved', affectedUsers: 234 },
  { id: 2, date: dates[27], type: 'User Reported', description: 'Inappropriate content in comments', status: 'Resolved', affectedUsers: 12 },
  { id: 3, date: dates[22], type: 'Technical', description: 'Payment processing failure', status: 'Resolved', affectedUsers: 87 },
  { id: 4, date: dates[18], type: 'Security', description: 'Suspicious login attempts detected', status: 'Resolved', affectedUsers: 5 },
  { id: 5, date: dates[10], type: 'User Reported', description: 'Class video quality issues', status: 'Resolved', affectedUsers: 142 },
  { id: 6, date: dates[3], type: 'Technical', description: 'API rate limiting issues', status: 'Investigating', affectedUsers: 67 },
  { id: 7, date: dates[1], type: 'User Reported', description: 'Incorrect class scheduling information', status: 'In Progress', affectedUsers: 23 }
];

// Filter function for date ranges
export const filterByDateRange = (data: any[], dateRange: { from: Date, to: Date }, dateField: string = 'date') => {
  return data.filter(item => {
    const itemDate = new Date(item[dateField]);
    return itemDate >= dateRange.from && itemDate <= dateRange.to;
  });
};
