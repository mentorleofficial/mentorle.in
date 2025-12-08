# Mentee Profile Management System

यह mentee profile management system है जो mentees को अपनी profile information को manage करने की सुविधा देता है।

## Features

### 1. Profile Management
- **View Profile**: Complete profile information display
- **Edit Profile**: Comprehensive profile editing form
- **Real-time Updates**: Immediate UI updates after changes
- **Profile Completion**: Visual progress tracking

### 2. Profile Information
- **Basic Information**: Name, email, phone, current status
- **Education**: Education level and related information
- **Bio**: Personal background and description
- **Goals**: Career and learning objectives
- **Interests**: Multiple interest selection
- **Preferred Industries**: Industry preferences
- **Location & Timezone**: Geographic and time preferences

### 3. Data Validation
- **Email Validation**: Proper email format checking
- **Phone Validation**: International phone number support
- **Required Fields**: Name and email are mandatory
- **Character Limits**: Bio and goals have 500 character limits

## Database Schema

### mentee_data Table
```sql
CREATE TABLE public.mentee_data (
  user_id UUID PRIMARY KEY,
  email VARCHAR(255),
  phone VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  education_level VARCHAR(100),
  interests TEXT,
  goals TEXT,
  updated_at TIMESTAMPTZ,
  interest TEXT[],
  bio TEXT,
  current_status TEXT,
  education JSONB,
  preferred_industeries TEXT[],
  location TEXT,
  timezone TEXT DEFAULT 'Asia/Kolkata',
  name TEXT
);
```

## Components Structure

```
src/app/dashboard/mentee/profile/
├── page.jsx                           # Main profile page
├── components/
│   ├── ProfileHeader.jsx              # Profile page header
│   ├── ProfileForm.jsx                # Profile editing form
│   └── ProfileDisplay.jsx             # Profile information display
└── README.md                          # This documentation

src/app/api/mentee/profile/
└── route.js                           # Profile API endpoints

src/components/
└── DashboardSidebar.jsx               # Updated with profile link
```

## API Endpoints

### Profile Management
- `GET /api/mentee/profile?user_id={id}` - Fetch mentee profile
- `PUT /api/mentee/profile` - Update mentee profile
- `POST /api/mentee/profile` - Create new mentee profile

## Usage Examples

### Basic Profile Operations
```javascript
// Fetch profile
const response = await fetch('/api/mentee/profile?user_id=123');
const { data } = await response.json();

// Update profile
const updateResponse = await fetch('/api/mentee/profile', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: '123',
    name: 'John Doe',
    bio: 'Software developer...',
    interests: ['Web Development', 'AI']
  })
});
```

### Component Integration
```jsx
import ProfileForm from './components/ProfileForm';
import ProfileDisplay from './components/ProfileDisplay';

function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  
  return (
    <div>
      {isEditing ? (
        <ProfileForm 
          profile={profile}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <ProfileDisplay profile={profile} />
      )}
    </div>
  );
}
```

## Form Fields

### Required Fields
- **Name**: Full name (minimum 3 characters)
- **Email**: Valid email address format

### Optional Fields
- **Phone**: International phone number
- **Current Status**: Professional status (e.g., Student, Professional)
- **Education Level**: Educational background
- **Bio**: Personal description (max 500 characters)
- **Goals**: Career objectives (max 500 characters)
- **Location**: Geographic location
- **Timezone**: Time zone preference
- **Interests**: Multiple selection from predefined list
- **Preferred Industries**: Industry preferences

### Education Levels
- High School
- Diploma
- Bachelor's Degree
- Master's Degree
- PhD
- Professional Certification
- Other

### Available Interests
- Web Development
- Mobile Development
- Data Science
- Machine Learning
- Artificial Intelligence
- Cybersecurity
- Cloud Computing
- DevOps
- UI/UX Design
- Product Management
- Digital Marketing
- Business Strategy
- Entrepreneurship
- Leadership
- Communication
- Project Management
- Sales
- Finance
- Healthcare
- Education

### Supported Industries
- Technology
- Healthcare
- Finance
- Education
- Marketing
- Design
- Engineering
- Business
- Media & Entertainment
- Real Estate
- Consulting
- Government
- Non-profit
- Other

### Supported Timezones
- Asia/Kolkata (IST)
- UTC
- America/New_York (EST)
- America/Los_Angeles (PST)
- Europe/London (GMT)
- Europe/Paris (CET)
- Asia/Tokyo (JST)
- Australia/Sydney (AEST)

## Key Features

### 1. Real-time Updates
- Immediate UI updates after profile changes
- Optimistic updates for better UX
- Error handling with rollback

### 2. User-friendly Interface
- Clean, intuitive form design
- Clear visual feedback
- Responsive layout
- Progress tracking

### 3. Data Validation
- Client-side validation for immediate feedback
- Server-side validation for security
- Input sanitization
- Error messaging

### 4. Profile Completion
- Visual progress indicator
- Completion percentage calculation
- Field-by-field completion tracking
- Encouragement to complete profile

## Security

- Row Level Security (RLS) enabled
- Users can only manage their own profiles
- Input validation and sanitization
- Protected API endpoints

## Navigation

### Dashboard Sidebar
- Profile link added to mentee navigation
- Easy access from main dashboard
- Consistent with other navigation items

## Future Enhancements

1. **Profile Picture**: Avatar upload functionality
2. **Social Links**: LinkedIn, GitHub, portfolio links
3. **Skills Assessment**: Technical skills evaluation
4. **Achievement Badges**: Learning milestones
5. **Profile Templates**: Pre-defined profile templates
6. **Export Profile**: PDF/JSON profile export
7. **Profile Analytics**: View and engagement statistics
8. **Profile Sharing**: Public profile links
9. **Mentor Matching**: AI-powered mentor suggestions
10. **Profile Verification**: Identity verification system

## Troubleshooting

### Common Issues

1. **Validation Errors**: Ensure all required fields are filled
2. **Phone Format**: Use international format without spaces
3. **Email Format**: Use valid email format
4. **Character Limits**: Bio and goals limited to 500 characters

### Error Handling

- All API calls include proper error handling
- User-friendly error messages
- Fallback states for loading/error scenarios
- Graceful degradation for network issues

### Data Validation

- Client-side validation for immediate feedback
- Server-side validation for security
- Input sanitization to prevent XSS
- Type checking for all inputs
