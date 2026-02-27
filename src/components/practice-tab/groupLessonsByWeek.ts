import { mockLessons, mockUser } from '../../data/mockData';

export const groupLessonsByWeek = () => {
  const weeks = [];
  for (let i = 0; i < 10; i++) {
    const weekNumber = i + 1;
    const weekLessons = mockLessons.slice(i * 7, (i + 1) * 7);
    
    // Check if any lesson in the week is available
    const hasAvailableLesson = weekLessons.some(lesson => lesson.available && lesson.day <= mockUser.currentDay);
    const allCompleted = weekLessons.every(lesson => lesson.completed);
    const isLocked = weekLessons.every(lesson => lesson.locked);
    
    weeks.push({
      weekNumber,
      lessons: weekLessons,
      title: weekLessons[0]?.title || '',
      available: hasAvailableLesson,
      completed: allCompleted,
      locked: isLocked,
      currentDay: weekLessons.find(l => l.day === mockUser.currentDay)?.day
    });
  }
  return weeks;
};
