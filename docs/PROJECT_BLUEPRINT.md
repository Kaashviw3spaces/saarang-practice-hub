# Saarang Practice Hub — Project Blueprint

**AI-Powered Music Club Management, Practice Coordination & Rehearsal System**  
**Source of Truth: Product Requirements, Technical Architecture, Database Design & Visual Direction**

---

## 1. Project Overview

**Saraang AI** is a smart management system for the Saraang college music club. It is designed to solve the everyday problems members face when sharing music practice rooms.

Currently, members may travel to the music room only to discover that somebody else is already practising. Drums, amplified electric guitars, speakers, vocals, and other instruments can interfere with one another, making individual practice difficult. Scheduling is often decided informally in the room, which means students who have not arrived have no reliable way of knowing whether the space is available.

Saraang AI will centralise this entire process. Members will be able to check availability before arriving, reserve practice time, identify compatible musicians, receive AI-generated practice-slot recommendations, and manage their sessions through an intelligent reminder and occupancy-tracking system.

The platform functions as both:
1. **A music club management system.**
2. **An AI-powered practice and rehearsal coordination assistant.**

The main goal is to maximise productive practice time, reduce unnecessary trips, prevent booking conflicts, improve room utilisation, and make sharing practice spaces fair and convenient.

---

## 2. Core Problems to Solve

1. Members do not know whether the practice room is occupied before arriving.
2. Instruments and audio equipment create different levels of acoustic interference.
3. Students learning individually may be unable to concentrate while louder instruments are being played.
4. Members cannot easily identify other musicians with whom they could practise simultaneously.
5. Manual booking and informal scheduling lead to overlapping sessions and misunderstandings.
6. Members may forget to check out, leaving the room incorrectly marked as occupied.
7. Members may forget their session's end time or struggle to finish practising within their allocated slot.
8. There is no systematic way to suggest compatible sessions, alternative times, or opportunities to extend a booking.
9. Members may monopolise rooms unless the system enforces fair booking and extension policies.
10. Club administrators need a central place to manage room schedules, instruments, equipment, and official rehearsals.

---

## 3. User Types and Permissions

### A. Club Members
- View current room occupancy and future availability.
- Book, cancel, and modify eligible sessions.
- Choose individual practice, collaborative practice, or band rehearsal.
- Specify their instrument, equipment, and audio-output setup.
- Set noise-tolerance and collaboration preferences.
- Receive notifications and request extensions.
- Join compatible shared-practice sessions.
- Report inaccurate occupancy information or equipment problems.
- View their own bookings and practice history.

### B. Club Administrators
- Manage member access and permissions.
- Create and manage practice rooms and available equipment.
- Configure opening hours, booking durations, and advance-booking limits.
- Schedule official band rehearsals, auditions, events, and performances.
- Define priority and extension policies.
- Monitor occupancy and resolve incorrect status reports.
- Review booking history, room utilisation, and equipment maintenance reports.
- Configure notifications and occupancy-sensor integrations.

*Official rehearsals and other authorised reservations must be protected from conflicting individual bookings.*

---

## 4. Main Application Sections

### 4.1 Home Dashboard
The dashboard displays:
- Current status of every practice room (states: **Available**, **Reserved**, **Occupied**, **Departure Pending**, **Occupancy Uncertain**).
- Who is practising, where appropriate under club privacy rules.
- Instruments currently in use and the type of session.
- Expected session end times.
- Next available slots.
- Upcoming personal bookings.
- Compatible practice opportunities.
- Notifications about session endings, cancellations, and released slots.
- Quick actions to book, extend, check in, or check out.

### 4.2 Practice and Rehearsal Booking
Members can select:
- Date and preferred time.
- Session duration (15, 30, 45, 60, 90 minutes).
- Room or practice area.
- Instrument(s) being used.
- Equipment and audio-output setup (e.g., headphones vs. amp).
- Practice purpose.
- Preferred noise level.
- Whether they want to practise alone or alongside compatible musicians.

### 4.3 Practice Modes
1. **Individual Practice**: Learning/rehearsing own parts; prioritises focus and low noise interference.
2. **Collaborative Practice**: Multiple musicians playing together without unacceptable interference; matching based on gear/goals.
3. **Band Rehearsal**: Full group rehearsal; continuous protected time window.

---

## 5. AI Instrument Compatibility and Acoustic Analysis

The system analyses the complete practice setup rather than treating an instrument as simply quiet or loud.

### 5.1 Factors to Analyse
- Instrument type & category (acoustic, electric, electronic).
- Monitoring & output: headphones vs. open speakers/amps.
- Peripheral equipment: audio interfaces, microphones, cables, pedals.
- Physical sound bleed (e.g., drum kit strikes or vocals remain loud even with headphones).
- Concentration requirements & room acoustic properties.

### 5.2 Compatibility Categories
- **Compatible**: Interference is negligible.
- **Conditionally Compatible**: Compatible under specific volume/gear conditions.
- **Incompatible**: Unacceptable noise bleed or distraction.
- **Insufficient Information**: Needs more setup detail.

---

## 6. Occupancy Tracking & Smart Timers

- **Hybrid tracking**: Phase 1 software QR check-in/checkout + automatic expiration; Phase 2 hardware sensors (mmWave).
- **Grace periods & confidence states**: When checkout is missed, transitions to Departure Pending before automatic closure.
- **Smart Session Timers**:
  - Mid-session check (remaining time).
  - Pre-expiry reminder (7–10 min before end) with options: *Continue*, *Rebook*, *Finish on Time*.
  - Final 2-minute wrap-up reminder.
- **Priority Continuation**: Current occupants get priority to extend if the slot is unreserved, subject to fair-use caps.

---

## 7. Technical Architecture & Database Design

### Tech Stack
- **Framework**: Next.js (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Icons & UI**: Lucide Icons

### Database Entities
- `profiles`: User identity, club role, notification preferences.
- `rooms`: Practice spaces, capacity, operating hours, acoustic properties.
- `instruments`: Available instruments and acoustic characteristics.
- `equipment`: Amps, cables, mics, audio interfaces, headphones.
- `room_equipment`: M2M relation of equipment in rooms.
- `bookings`: Reservations, mode (individual/collab/band), time ranges, status.
- `booking_members`: Participants in a booking.
- `booking_instruments`: Instruments utilized in a booking.
- `compatibility_rules`: Explicit compatibility criteria.
- `occupancy_events`: Sensor/QR check-ins and check-outs.
- `notifications`: Session alerts and reminders.
- `extension_requests`: Priority extension records.
- `waitlist_entries`: Queued reservation requests.

---

## 8. UI/UX & Design Direction: Independent Music Editorial

Inspired by vintage rock posters, concert prints, and contemporary music editorial aesthetics (e.g., Carrière Scène, vintage gig posters):
- **Atmosphere**: Textured, tactile, refined dark-palette editorial design.
- **Palette**:
  - `--color-background: #151311` (Deep warm charcoal/black)
  - `--color-surface: #24211d` (Warm dark slate/card surface)
  - `--color-paper: #f2e8cc` (Vintage newsprint / cream)
  - `--color-accent: #d9bd43` (Warm vintage gold/amber)
  - `--color-secondary: #397d98` (Muted teal/electric blue)
  - `--color-text: #f7f0df` (Cream text)
- **Typography & Hero**: Bold display headlines ("Make Room for Music"), crisp condensed labels, high-contrast badges, tactile borders.
