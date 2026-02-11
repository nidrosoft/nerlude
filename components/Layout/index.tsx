import { useState, useEffect, useCallback, useRef, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import ThemeButton from "@/components/ThemeButton";
import Footer from "@/components/Footer";
import UpButton from "@/components/UpButton";
import MobileNav from "@/components/MobileNav";
import HelpWidget from "@/components/HelpWidget";
import WorkspaceLoadingOverlay from "@/components/WorkspaceLoadingOverlay";
import { useAuth } from "@/lib/auth";
import { getSupabaseClient } from "@/lib/db";
import { Alert } from "@/types";

// Context to allow child components to open the auth modal
const AuthModalContext = createContext<(() => void) | null>(null);
export const useAuthModal = () => useContext(AuthModalContext);

type Props = {
    className?: string;
    classContainer?: string;
    isFixedHeader?: boolean;
    isLoggedIn?: boolean;
    isVisiblePlan?: boolean;
    isHiddenFooter?: boolean;
    children: React.ReactNode;
    alerts?: Alert[];
    onMarkAsRead?: (id: string) => void;
    onMarkAllAsRead?: () => void;
};

const Layout = ({
    className,
    classContainer,
    isFixedHeader,
    isLoggedIn,
    isVisiblePlan,
    isHiddenFooter,
    children,
    alerts: externalAlerts,
    onMarkAsRead: externalOnMarkAsRead,
    onMarkAllAsRead: externalOnMarkAllAsRead,
}: Props) => {
    const router = useRouter();
    const { signOut } = useAuth();
    const [loginOpen, setLoginOpen] = useState(isLoggedIn);
    const [internalAlerts, setInternalAlerts] = useState<Alert[]>([]);
    const openAuthModalRef = useRef<(() => void) | null>(null);

    // Fetch notifications from API when logged in
    const fetchNotifications = useCallback(async () => {
        if (!isLoggedIn) return;
        
        try {
            // Fetch both notifications and dashboard alerts
            const [notificationsRes, alertsRes] = await Promise.all([
                fetch('/api/notifications'),
                fetch('/api/dashboard/alerts'),
            ]);
            
            const allAlerts: Alert[] = [];
            
            // Process notifications
            if (notificationsRes.ok) {
                const data = await notificationsRes.json();
                data.forEach((n: Record<string, unknown>) => {
                    let priority: 'high' | 'medium' | 'low' = 'medium';
                    const nData = n.data as Record<string, unknown> || {};
                    const subtype = nData.subtype as string;
                    
                    if (n.type === 'renewal' || subtype === 'renewal_urgent' || subtype === 'member_removed') {
                        priority = 'high';
                    } else if (subtype === 'member_invited' || subtype === 'member_role_changed') {
                        priority = 'medium';
                    } else {
                        priority = 'low';
                    }
                    
                    const alertType: 'renewal' | 'cost_alert' | 'team' | 'system' = n.type as 'renewal' | 'cost_alert' | 'team' | 'system';
                    
                    allAlerts.push({
                        id: n.id as string,
                        type: alertType,
                        priority,
                        title: n.title as string,
                        message: n.message as string,
                        projectId: nData.project_id as string | undefined,
                        projectName: nData.project_name as string | undefined,
                        serviceId: nData.service_id as string | undefined,
                        serviceName: nData.service_name as string | undefined,
                        dueDate: nData.renewal_date as string | undefined,
                        isRead: !!n.read_at,
                        isDismissed: !!n.dismissed_at,
                        createdAt: n.created_at as string,
                    });
                });
            }
            
            // Process dashboard alerts (renewals, cost alerts, etc.)
            if (alertsRes.ok) {
                const data = await alertsRes.json();
                data.forEach((a: Record<string, unknown>) => {
                    // Skip if already exists (by id)
                    if (allAlerts.some(existing => existing.id === a.id)) return;
                    
                    const severity = a.severity as string;
                    let priority: 'high' | 'medium' | 'low' = 'medium';
                    if (severity === 'high' || severity === 'critical') priority = 'high';
                    else if (severity === 'low') priority = 'low';
                    
                    allAlerts.push({
                        id: a.id as string,
                        type: (a.type as 'renewal' | 'cost_alert' | 'team' | 'system') || 'system',
                        priority,
                        title: a.title as string,
                        message: a.message as string,
                        projectId: a.projectId as string | undefined,
                        projectName: a.projectName as string | undefined,
                        serviceId: a.serviceId as string | undefined,
                        serviceName: a.serviceName as string | undefined,
                        dueDate: a.date as string | undefined,
                        isRead: false,
                        isDismissed: false,
                        createdAt: new Date().toISOString(),
                    });
                });
            }
            
            setInternalAlerts(allAlerts);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    }, [isLoggedIn]);

    // Fetch notifications on mount and when logged in
    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    // Use external alerts if provided, otherwise use internal
    const alerts = externalAlerts && externalAlerts.length > 0 ? externalAlerts : internalAlerts;

    // Internal handlers for marking as read
    const handleMarkAsRead = async (id: string) => {
        if (externalOnMarkAsRead) {
            externalOnMarkAsRead(id);
        } else {
            setInternalAlerts(prev => prev.map(a => a.id === id ? { ...a, isDismissed: true } : a));
            try {
                await fetch(`/api/notifications/${id}/dismiss`, { method: 'PATCH' });
            } catch (error) {
                console.error('Failed to dismiss notification:', error);
            }
        }
    };

    const handleMarkAllAsRead = async () => {
        if (externalOnMarkAllAsRead) {
            externalOnMarkAllAsRead();
        } else {
            const undismissed = internalAlerts.filter(a => !a.isDismissed);
            setInternalAlerts(prev => prev.map(a => ({ ...a, isDismissed: true })));
            try {
                await Promise.all(undismissed.map(a => 
                    fetch(`/api/notifications/${a.id}/dismiss`, { method: 'PATCH' })
                ));
            } catch (error) {
                console.error('Failed to dismiss all notifications:', error);
            }
        }
    };

    // Check auth when page becomes visible (handles back button after logout)
    useEffect(() => {
        if (!isLoggedIn) return;

        const handleVisibilityChange = async () => {
            if (document.visibilityState === 'visible') {
                const supabase = getSupabaseClient();
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                    window.location.replace("/");
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // Also check on popstate (back/forward navigation)
        const handlePopState = async () => {
            const supabase = getSupabaseClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                window.location.replace("/");
            }
        };
        
        window.addEventListener('popstate', handlePopState);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('popstate', handlePopState);
        };
    }, [isLoggedIn]);

    const content = (
        <div
            className={`flex flex-col min-h-screen ${
                isVisiblePlan ? "relative" : ""
            } ${className || ""}`}
        >
            {isVisiblePlan && (
                <>
                    <div className="fixed left-0 top-0 right-0 z-2 h-32 pointer-events-none bg-linear-to-b from-b-surface1 from-50% to-transparent max-md:h-22 max-md:from-80%"></div>
                    <div className="fixed left-0 bottom-0 right-0 z-2 h-32 pointer-events-none bg-linear-to-t from-b-surface1 from-50% to-transparent max-md:h-22 max-md:from-80%"></div>
                </>
            )}
            <Header
                isFixed={isFixedHeader}
                login={loginOpen}
                isVisiblePlan={isVisiblePlan}
                onLogin={() => setLoginOpen(true)}
                onLogout={async () => {
                    await signOut();
                    setLoginOpen(false);
                    router.push("/");
                }}
                alerts={alerts}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
                onOpenAuthModal={(fn) => { openAuthModalRef.current = fn; }}
            />
            <AuthModalContext.Provider value={() => openAuthModalRef.current?.()}>
                <div className={`grow ${classContainer || ""}`}>{children}</div>
            </AuthModalContext.Provider>
            {!isHiddenFooter && <Footer />}
            <ThemeButton className="fixed! left-5 bottom-5 z-5 max-md:bottom-20" />
            <UpButton />
            {isLoggedIn && <MobileNav />}
            {isLoggedIn && <HelpWidget />}
            <WorkspaceLoadingOverlay />
        </div>
    );

    return content;
};

export default Layout;
