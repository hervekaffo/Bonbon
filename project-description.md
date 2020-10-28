# Bonbon Backend API Specifications

Create the backend for a Social Sport App. The frontend/UI will be created by another team ceratinly a React app and a mobile(React Native) app. All of the functionality below needs to be fully implmented in this project.

### Event(Sport Event)
- List all events in the database
   * Pagination
   * Select specific fields in result
   * Limit number of results
   * Filter by fields
- Search events by radius from zipcode
  * Use a geocoder to get exact location and coords from a single address field
- Get single event
- Create new event
  * Authenticated users only
  * Must have the role "publisher" or "admin"
  * Only one event per publisher (admins can create more)
  * Field validation via Mongoose
- Upload a photo for event
  * Owner only
  * Photo will be uploaded to local filesystem
- Update events
  * Owner only
  * Validation on update
- Delete Event
  * Owner only
- Calculate the average cost of all sports for an event
- Calculate the average rating from the reviews for an event

### sports
- List all sports for sport event
- List all sports in general
  * Pagination, filtering, etc
- Get single sport
- Create new sport
  * Authenticated users only
  * Must have the role "publisher" or "admin"
  * Only the owner or an admin can create a sport for a sport event
  * Publishers can create multiple sports
- Update sport
  * Owner only
- Delete sport
  * Owner only
  
  ### Reviews & Comments
- List all reviews for a sport event
- List all reviews in general
  * Pagination, filtering, etc
- Get a single review
- Create a review & comments (the table review must have a field "comment")
  * Authenticated users only
  * Must have the role "user" or "admin" (comments only if publishers)
- Update review
  * Owner only
- Delete review
  * Owner only
  
  ### Users & Authentication
- Authentication will be ton using JWT/cookies
  * JWT and cookie should expire in 30 days
- User registration
  * Register as a "user" or "publisher"
  * Once registered, a token will be sent along with a cookie (token = xxx)
  * Passwords must be hashed
- User login
  * User can login with email and password
  * Plain text password will compare with stored hashed password
  * Once logged in, a token will be sent along with a cookie (token = xxx)
- User logout
  * Cookie will be sent to set token = none
- Get user
  * Route to get the currently logged in user (via token)
- Password reset (lost password)
  * User can request to reset password
  * A hashed token will be emailed to the users registered email address
  * A put request can be made to the generated url to reset password
  * The token will expire after 10 minutes
- Update user info
  * Authenticated user only
  * Separate route to update password
- User CRUD
  * Admin only
- Users can only be made admin by updating the database field manually