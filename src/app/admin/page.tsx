"use client"

import { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Dashboard } from '@/components/screens/Dashboard';
import { LessonBuilder } from '@/components/screens/LessonBuilder';
import { LessonFlowBuilder } from '@/components/screens/LessonFlowBuilder';
import { ContentDashboard } from '@/components/screens/ContentDashboard';
import { UserManagement } from '@/components/screens/UserManagement';
import { UserDetailManagement } from '@/components/screens/UserDetailManagement';
import { SignupQueue } from '@/components/screens/SignupQueue';
import { PromptManagement } from '@/components/screens/PromptManagement';
import { FeedbackQueue } from '@/components/screens/FeedbackQueue';
import { FeedbackDetail } from '@/components/screens/FeedbackDetail';
import { UserFeedback } from '@/components/screens/UserFeedback';
import { CircleManagement } from '@/components/screens/CircleManagement';
import { CircleCommunication } from '@/components/screens/CircleCommunication';
import { CircleRequests } from '@/components/screens/CircleRequests';
import { CelebrationDashboard } from '@/components/screens/CelebrationDashboard';
import { SystemSettings } from '@/components/screens/SystemSettings';
import { FeedContent } from '@/components/screens/FeedContent';
import { Toaster } from '@/components/ui/sonner';

function Admin() {
    const [currentScreen, setCurrentScreen] = useState('dashboard');
    const [showUserDetail, setShowUserDetail] = useState(false);
    const [showFeedbackDetail, setShowFeedbackDetail] = useState(false);
    const [showLessonBuilder, setShowLessonBuilder] = useState(false);
    const [selectedDay, setSelectedDay] = useState<number>(1);
    const [selectedUserId, setSelectedUserId] = useState<number>(1);

    const handleNavigate = (screen: string) => {
        setCurrentScreen(screen);
        setShowUserDetail(false);
        setShowFeedbackDetail(false);
        setShowLessonBuilder(false);
    };

    const handleOpenLessonBuilder = (day: number) => {
        setSelectedDay(day);
        setShowLessonBuilder(true);
    };

    const handleViewUser = (userId: number) => {
        setSelectedUserId(userId);
        setShowUserDetail(true);
    };

    const renderScreen = () => {
        // Handle sub-views
        if (showUserDetail) {
            return <UserDetailManagement userId={selectedUserId} onBack={() => setShowUserDetail(false)} />;
        }
        if (showFeedbackDetail) {
            return <FeedbackDetail onBack={() => setShowFeedbackDetail(false)} />;
        }
        if (showLessonBuilder) {
            return <LessonBuilder day={selectedDay} onBack={() => setShowLessonBuilder(false)} />;
        }

        // Main screens
        switch (currentScreen) {
            case 'dashboard':
                return <Dashboard />;
            case 'content-dashboard':
                return <ContentDashboard onEditDay={handleOpenLessonBuilder} />;
            case 'lesson-flow-builder':
                return <LessonFlowBuilder />;
            case 'user-management':
                return <UserManagement onViewUser={handleViewUser} />;
            case 'signup-queue':
                return <SignupQueue />;
            case 'feedback-queue':
                return <FeedbackQueue onViewFeedback={() => setShowFeedbackDetail(true)} />;
            case 'user-feedback':
                return <UserFeedback />;
            case 'circle-management':
                return <CircleManagement />;
            case 'circle-communication':
                return <CircleCommunication />;
            case 'circle-requests':
                return <CircleRequests />;
            case 'celebrations':
                return <CelebrationDashboard />;
            case 'settings':
                return <SystemSettings />;
            case 'feed-content':
                return <FeedContent />;
            case 'prompt-management':
                return <PromptManagement />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <>
            <AdminLayout currentScreen={currentScreen} onNavigate={handleNavigate}>
                {renderScreen()}
            </AdminLayout>
            <Toaster />
        </>
    );
}

export default Admin;