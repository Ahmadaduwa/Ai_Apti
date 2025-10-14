export const schedule = [
  { time: '08:30', subject: 'Mathematics', room: '301', className: 'M3-A' },
  { time: '10:00', subject: 'Science', room: '302', className: 'M3-A' },
  { time: '13:00', subject: 'English', room: '204', className: 'M3-B' },
]

export const students = Array.from({ length: 10 }).map((_, i) => ({ id: i+1, name: `Student ${i+1}` }))

export const announcements = [
  { title: 'Midterm Examination', body: 'Midterm schedule will be released next week.' },
  { title: 'Robotics Club', body: 'Join us every Friday 3PM at Room 105.' },
]


