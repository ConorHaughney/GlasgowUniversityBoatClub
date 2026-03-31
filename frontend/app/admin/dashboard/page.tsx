"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Loader2,
    Save,
    Camera,
    LogOut,
    Users,
    Calendar,
    Newspaper,
    Plus,
    Pencil,
    Trash2,
    Shield,
    X,
} from "lucide-react";
import CommitteePhotoCropModal from "../../../components/CommitteePhotoCropModal";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
const MAX_CROPPED_IMAGE_BYTES = 5 * 1024 * 1024;

type TabKey = "committee" | "news" | "events" | "permissions";

type Permission =
    | "NEWS_MANAGE"
    | "EVENTS_MANAGE"
    | "MERCH_MANAGE"
    | "COMMITTEE_MANAGE"
    | "USER_ADMIN"
    | "RESET_LINKS_ADMIN";

const ALL_PERMISSIONS: Permission[] = [
    "COMMITTEE_MANAGE",
    "NEWS_MANAGE",
    "EVENTS_MANAGE",
    "MERCH_MANAGE",
    "RESET_LINKS_ADMIN",
    "USER_ADMIN",
];

const PERMISSION_LABELS: Record<Permission, string> = {
    COMMITTEE_MANAGE: "Committee",
    NEWS_MANAGE: "News",
    EVENTS_MANAGE: "Events",
    MERCH_MANAGE: "Merch",
    RESET_LINKS_ADMIN: "Reset Links",
    USER_ADMIN: "User Admin",
};

const HIDDEN_PERMISSION_EDIT_EMAILS = new Set(["cphaughney99@gmail.com"]);

type CommitteeMember = {
    id: string;
    role: string;
    name: string;
    bio: string;
    photoUrl: string;
};

type CommitteeMemberResponse = {
    id: number;
    role: string;
    name: string;
    bio: string;
    image_url: string;
};

type NewsItem = {
    id: number;
    title: string;
    body: string;
    image_url: string;
    author: string;
    published_at: string;
};

type NewsDraft = {
    title: string;
    body: string;
    image_url: string;
    author: string;
    published_at: string;
};

type EventItem = {
    id: number;
    title: string;
    featured: boolean;
    description: string;
    date: string;
    endDate: string;
    time: string;
    location: string;
    type: string;
};

type EventDraft = {
    title: string;
    featured: boolean;
    description: string;
    date: string;
    endDate: string;
    time: string;
    location: string;
    type: string;
};

type AdminUserResponse = {
    id: number;
    email: string;
    role: string;
    permissionsOverrideEnabled?: boolean;
    permissionSet?: string[];
    permissionsCsv?: string;
};

type UserPermissionDraft = {
    overrideEnabled: boolean;
    permissions: Permission[];
    dirty: boolean;
};

const emptyNewsDraft: NewsDraft = {
    title: "",
    body: "",
    image_url: "",
    author: "",
    published_at: "",
};

const emptyEventDraft: EventDraft = {
    title: "",
    featured: false,
    description: "",
    date: "",
    endDate: "",
    time: "",
    location: "",
    type: "Competition",
};

export default function AdminDashboardPage() {
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<TabKey>("committee");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [permissions, setPermissions] = useState<Set<Permission>>(new Set());
    const [adminRole, setAdminRole] = useState("");
    const [isLegacyFullAccess, setIsLegacyFullAccess] = useState(false);

    const [committee, setCommittee] = useState<CommitteeMember[]>([]);
    const [savingCommittee, setSavingCommittee] = useState(false);
    const photoFilesRef = useRef<Map<string, File>>(new Map());
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [cropTargetMemberId, setCropTargetMemberId] = useState<string | null>(null);
    const [cropSourceUrl, setCropSourceUrl] = useState<string | null>(null);
    const [cropSourceIsObjectUrl, setCropSourceIsObjectUrl] = useState(false);
    const [cropSourceFileName, setCropSourceFileName] = useState("committee-photo.jpg");

    const [news, setNews] = useState<NewsItem[]>([]);
    const [savingNews, setSavingNews] = useState(false);
    const [editingNewsId, setEditingNewsId] = useState<number | null>(null);
    const [newsModalOpen, setNewsModalOpen] = useState(false);
    const [newsDraft, setNewsDraft] = useState<NewsDraft>(emptyNewsDraft);

    const [events, setEvents] = useState<EventItem[]>([]);
    const [savingEvent, setSavingEvent] = useState(false);
    const [editingEventId, setEditingEventId] = useState<number | null>(null);
    const [eventModalOpen, setEventModalOpen] = useState(false);
    const [eventDraft, setEventDraft] = useState<EventDraft>(emptyEventDraft);

    const [users, setUsers] = useState<AdminUserResponse[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [savingUserId, setSavingUserId] = useState<number | null>(null);
    const [userPermissionDrafts, setUserPermissionDrafts] = useState<Record<number, UserPermissionDraft>>({});

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/admin");
            return;
        }

        const rawPermissions = localStorage.getItem("adminPermissions");
        const role = localStorage.getItem("adminRole");
        setAdminRole(role ?? "");
        const isPrivilegedRole = role === "ADMIN" || role === "DEVELOPER";
        try {
            const parsed = rawPermissions ? JSON.parse(rawPermissions) : [];
            if (Array.isArray(parsed) && parsed.length > 0) {
                setPermissions(new Set(parsed as Permission[]));
                setIsLegacyFullAccess(false);
            } else {
                setIsLegacyFullAccess(isPrivilegedRole || !rawPermissions);
            }
        } catch {
            setIsLegacyFullAccess(isPrivilegedRole || !rawPermissions);
        }

        const loadInitialData = async () => {
            setLoading(true);
            setError("");
            try {
                await Promise.all([fetchCommittee(), fetchNews(), fetchEvents()]);
            } catch (e) {
                setError((e as Error).message || "Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, [router]);

    const hasPermission = (permission: Permission) => isLegacyFullAccess || permissions.has(permission);

    const canManageCommittee = hasPermission("COMMITTEE_MANAGE");
    const canManageNews = hasPermission("NEWS_MANAGE");
    const canManageEvents = hasPermission("EVENTS_MANAGE");
    const canManageResetLinks = hasPermission("RESET_LINKS_ADMIN");
    const canAccessPermissionsTab = hasPermission("USER_ADMIN");
    const canEditPermissionOverrides = adminRole === "ADMIN" || adminRole === "DEVELOPER";

    useEffect(() => {
        const availableTabs: TabKey[] = [];
        if (canManageCommittee) availableTabs.push("committee");
        if (canManageNews) availableTabs.push("news");
        if (canManageEvents) availableTabs.push("events");
        if (canAccessPermissionsTab) availableTabs.push("permissions");

        if (availableTabs.length > 0 && !availableTabs.includes(activeTab)) {
            setActiveTab(availableTabs[0]);
        }
    }, [activeTab, canManageCommittee, canManageEvents, canManageNews, canAccessPermissionsTab]);

    const getTokenOrRedirect = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/admin");
            return null;
        }
        return token;
    };

    const authHeaders = (token: string) => ({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    });

    const handleUnauthorized = () => {
        localStorage.removeItem("token");
        router.push("/admin");
    };

    const fetchCommittee = async () => {
        const token = getTokenOrRedirect();
        if (!token) return;

        const res = await fetch(`${API_URL}/api/committee`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401 || res.status === 403) {
            handleUnauthorized();
            return;
        }
        if (!res.ok) throw new Error("Failed to load committee");

        const raw = await res.json();
        const data = Array.isArray(raw)
            ? raw.map((m: CommitteeMemberResponse) => ({
                  id: String(m.id),
                                    role: m.role ?? "",
                                    name: m.name ?? "",
                                    bio: m.bio ?? "",
                                    photoUrl: m.image_url ?? "",
              }))
            : [];

        setCommittee(data);
    };

    const fetchNews = async () => {
        const res = await fetch(`${API_URL}/api/news`);
        if (!res.ok) throw new Error("Failed to load news");
        const data = await res.json();
        const items: NewsItem[] = Array.isArray(data) ? data : [];
        items.sort(
            (a, b) =>
                new Date(b.published_at ?? "").getTime() -
                new Date(a.published_at ?? "").getTime()
        );
        setNews(items);
    };

    const fetchEvents = async () => {
        const res = await fetch(`${API_URL}/api/events`);
        if (!res.ok) throw new Error("Failed to load events");
        const data = await res.json();
        const items: EventItem[] = Array.isArray(data) ? data : [];
        items.sort(
            (a, b) =>
                new Date(b.date ?? "").getTime() - new Date(a.date ?? "").getTime()
        );
        setEvents(items);
    };

    const normalizePermissionList = (rawPermissions: unknown): Permission[] => {
        if (!Array.isArray(rawPermissions)) {
            return [];
        }

        const validPermissions = new Set<Permission>(ALL_PERMISSIONS);
        return rawPermissions
            .map((permission) => String(permission).trim())
            .filter((permission): permission is Permission => validPermissions.has(permission as Permission));
    };

    const parseUserPermissions = (user: AdminUserResponse): Permission[] => {
        if (Array.isArray(user.permissionSet) && user.permissionSet.length > 0) {
            return normalizePermissionList(user.permissionSet);
        }

        if (typeof user.permissionsCsv === "string" && user.permissionsCsv.trim().length > 0) {
            return normalizePermissionList(user.permissionsCsv.split(","));
        }

        return [];
    };

    const fetchUsers = async () => {
        const token = getTokenOrRedirect();
        if (!token) return;

        setLoadingUsers(true);
        setError("");

        try {
            const res = await fetch(`${API_URL}/api/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.status === 401 || res.status === 403) {
                handleUnauthorized();
                return;
            }
            if (!res.ok) throw new Error("Failed to load users");

            const raw = await res.json();
            const data: AdminUserResponse[] = Array.isArray(raw) ? raw : [];
            setUsers(data);

            const initialDrafts: Record<number, UserPermissionDraft> = {};
            data.forEach((user) => {
                initialDrafts[user.id] = {
                    overrideEnabled: !!user.permissionsOverrideEnabled,
                    permissions: parseUserPermissions(user),
                    dirty: false,
                };
            });
            setUserPermissionDrafts(initialDrafts);
        } catch (e) {
            setError((e as Error).message || "Failed to load users");
        } finally {
            setLoadingUsers(false);
        }
    };

    useEffect(() => {
        if (activeTab === "permissions" && canAccessPermissionsTab && users.length === 0 && !loadingUsers) {
            void fetchUsers();
        }
    }, [activeTab, canAccessPermissionsTab, users.length, loadingUsers]);

    const setDraftOverrideEnabled = (userId: number, enabled: boolean) => {
        setUserPermissionDrafts((prev) => {
            const current = prev[userId] ?? {
                overrideEnabled: false,
                permissions: [],
                dirty: false,
            };

            return {
                ...prev,
                [userId]: {
                    ...current,
                    overrideEnabled: enabled,
                    dirty: true,
                },
            };
        });
    };

    const toggleDraftPermission = (userId: number, permission: Permission) => {
        setUserPermissionDrafts((prev) => {
            const current = prev[userId] ?? {
                overrideEnabled: false,
                permissions: [],
                dirty: false,
            };

            const hasPermissionInDraft = current.permissions.includes(permission);
            const nextPermissions = hasPermissionInDraft
                ? current.permissions.filter((item) => item !== permission)
                : [...current.permissions, permission];

            return {
                ...prev,
                [userId]: {
                    ...current,
                    permissions: nextPermissions,
                    dirty: true,
                },
            };
        });
    };

    const saveUserPermissionOverride = async (userId: number) => {
        const token = getTokenOrRedirect();
        if (!token) return;

        if (!canEditPermissionOverrides) {
            setError("Only ADMIN users can change manual permission overrides.");
            return;
        }

        const draft = userPermissionDrafts[userId];
        if (!draft) {
            return;
        }

        setSavingUserId(userId);
        setError("");
        setMessage("");

        try {
            const res = await fetch(`${API_URL}/api/users/${userId}/permissions`, {
                method: "PUT",
                headers: authHeaders(token),
                body: JSON.stringify({
                    overrideEnabled: draft.overrideEnabled,
                    permissions: draft.permissions,
                }),
            });

            if (res.status === 401 || res.status === 403) {
                handleUnauthorized();
                return;
            }
            if (!res.ok) throw new Error("Failed to update user permissions");

            setUserPermissionDrafts((prev) => ({
                ...prev,
                [userId]: {
                    ...prev[userId],
                    dirty: false,
                },
            }));

            setMessage("User permission override updated.");
        } catch (e) {
            setError((e as Error).message || "Failed to update user permissions");
        } finally {
            setSavingUserId(null);
        }
    };

    const updateMember = (id: string, patch: Partial<CommitteeMember>) => {
        setCommittee((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
    };

    const closeCropModal = () => {
        if (cropSourceUrl && cropSourceIsObjectUrl) {
            URL.revokeObjectURL(cropSourceUrl);
        }
        setCropModalOpen(false);
        setCropTargetMemberId(null);
        setCropSourceUrl(null);
        setCropSourceIsObjectUrl(false);
    };

    const openCropModalForMember = (
        memberId: string,
        sourceUrl: string,
        fileName: string,
        isObjectUrl: boolean
    ) => {
        if (cropSourceUrl && cropSourceIsObjectUrl) {
            URL.revokeObjectURL(cropSourceUrl);
        }

        setError("");
        setMessage("");
        setCropTargetMemberId(memberId);
        setCropSourceFileName(fileName || "committee-photo.jpg");
        setCropSourceUrl(sourceUrl);
        setCropSourceIsObjectUrl(isObjectUrl);
        setCropModalOpen(true);
    };

    const handlePhotoSelect = (id: string, file: File | null) => {
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Only image files can be uploaded for committee photos.");
            return;
        }

        const sourceUrl = URL.createObjectURL(file);
        openCropModalForMember(id, sourceUrl, file.name || "committee-photo.jpg", true);
    };

    const handleEditExistingPhoto = (member: CommitteeMember) => {
        if (!member.photoUrl || !member.photoUrl.trim()) {
            setError("No existing image available to edit. Please upload a photo first.");
            return;
        }

        openCropModalForMember(member.id, member.photoUrl, `${member.role || "committee-photo"}.jpg`, false);
    };

    const handleCropConfirm = (croppedFile: File, previewUrl: string) => {
        if (!cropTargetMemberId) {
            URL.revokeObjectURL(previewUrl);
            closeCropModal();
            return;
        }

        if (croppedFile.size > MAX_CROPPED_IMAGE_BYTES) {
            URL.revokeObjectURL(previewUrl);
            setError("Cropped image is too large. Please reduce zoom or pick a smaller image (max 5 MB).");
            return;
        }

        updateMember(cropTargetMemberId, { photoUrl: previewUrl });
        photoFilesRef.current.set(cropTargetMemberId, croppedFile);
        closeCropModal();
    };

    const saveCommittee = async () => {
        const token = getTokenOrRedirect();
        if (!token) return;

        setSavingCommittee(true);
        setError("");
        setMessage("");

        try {
            const detailsRes = await fetch(`${API_URL}/api/admin/committee`, {
                method: "PUT",
                headers: authHeaders(token),
                body: JSON.stringify({
                    members: committee.map(({ id, name, bio }) => ({ id, name, bio })),
                }),
            });

            if (detailsRes.status === 401 || detailsRes.status === 403) {
                handleUnauthorized();
                return;
            }
            if (!detailsRes.ok) throw new Error("Failed to save committee details");

            for (const [id, file] of photoFilesRef.current.entries()) {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("id", id);

                const uploadRes = await fetch(`${API_URL}/api/admin/committee/photo`, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData,
                });

                if (!uploadRes.ok) throw new Error(`Failed to upload photo for member ${id}`);
            }

            photoFilesRef.current.clear();
            setMessage("Committee updated successfully.");
            await fetchCommittee();
        } catch (e) {
            setError((e as Error).message || "Failed to save committee");
        } finally {
            setSavingCommittee(false);
        }
    };

    const openCreateNews = () => {
        setEditingNewsId(null);
        setNewsDraft(emptyNewsDraft);
        setNewsModalOpen(true);
        setError("");
        setMessage("");
    };

    const openEditNews = (item: NewsItem) => {
        setEditingNewsId(item.id);
        setNewsDraft({
            title: item.title ?? "",
            body: item.body ?? "",
            image_url: item.image_url ?? "",
            author: item.author ?? "",
            published_at: item.published_at
                ? new Date(item.published_at).toISOString().split("T")[0]
                : "",
        });
        setNewsModalOpen(true);
        setError("");
        setMessage("");
    };

    const saveNews = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = getTokenOrRedirect();
        if (!token) return;

        setSavingNews(true);
        setError("");
        setMessage("");

        try {
            const isEdit = editingNewsId !== null;
            const url = isEdit
                ? `${API_URL}/api/news/${editingNewsId}`
                : `${API_URL}/api/news`;

            const res = await fetch(url, {
                method: isEdit ? "PUT" : "POST",
                headers: authHeaders(token),
                body: JSON.stringify({
                    title: newsDraft.title,
                    body: newsDraft.body,
                    image_url: newsDraft.image_url || null,
                    author: newsDraft.author || null,
                    published_at: newsDraft.published_at || null,
                }),
            });

            if (res.status === 401 || res.status === 403) {
                handleUnauthorized();
                return;
            }
            if (!res.ok) throw new Error("Failed to save news item");

            setMessage(isEdit ? "News article updated." : "News article created.");
            setNewsModalOpen(false);
            await fetchNews();
        } catch (err) {
            setError((err as Error).message || "Failed to save news item");
        } finally {
            setSavingNews(false);
        }
    };

    const deleteNews = async (id: number) => {
        const token = getTokenOrRedirect();
        if (!token) return;
        if (!window.confirm("Delete this news article?")) return;

        setError("");
        setMessage("");

        try {
            const res = await fetch(`${API_URL}/api/news/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.status === 401 || res.status === 403) {
                handleUnauthorized();
                return;
            }
            if (!res.ok) throw new Error("Failed to delete news item");

            setMessage("News article deleted.");
            setNews((prev) => prev.filter((n) => n.id !== id));
        } catch (err) {
            setError((err as Error).message || "Failed to delete news item");
        }
    };

    const openCreateEvent = () => {
        setEditingEventId(null);
        setEventDraft(emptyEventDraft);
        setEventModalOpen(true);
        setError("");
        setMessage("");
    };

    const openEditEvent = (item: EventItem) => {
        setEditingEventId(item.id);
        setEventDraft({
            title: item.title ?? "",
            featured: !!item.featured,
            description: item.description ?? "",
            date: item.date ?? "",
            endDate: item.endDate ?? "",
            time: item.time ?? "",
            location: item.location ?? "",
            type: item.type ?? "Competition",
        });
        setEventModalOpen(true);
        setError("");
        setMessage("");
    };

    const saveEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = getTokenOrRedirect();
        if (!token) return;

        setSavingEvent(true);
        setError("");
        setMessage("");

        try {
            const isEdit = editingEventId !== null;
            const url = isEdit
                ? `${API_URL}/api/events/${editingEventId}`
                : `${API_URL}/api/events`;

            const res = await fetch(url, {
                method: isEdit ? "PUT" : "POST",
                headers: authHeaders(token),
                body: JSON.stringify({
                    title: eventDraft.title,
                    featured: !!eventDraft.featured,
                    description: eventDraft.description || null,
                    date: eventDraft.date || null,
                    endDate: eventDraft.endDate || null,
                    time: eventDraft.time || null,
                    location: eventDraft.location || null,
                    type: eventDraft.type || null,
                }),
            });

            if (res.status === 401 || res.status === 403) {
                handleUnauthorized();
                return;
            }
            if (!res.ok) throw new Error("Failed to save event");

            setMessage(isEdit ? "Event updated." : "Event created.");
            setEventModalOpen(false);
            await fetchEvents();
        } catch (err) {
            setError((err as Error).message || "Failed to save event");
        } finally {
            setSavingEvent(false);
        }
    };

    const deleteEvent = async (id: number) => {
        const token = getTokenOrRedirect();
        if (!token) return;
        if (!window.confirm("Delete this event?")) return;

        setError("");
        setMessage("");

        try {
            const res = await fetch(`${API_URL}/api/events/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.status === 401 || res.status === 403) {
                handleUnauthorized();
                return;
            }
            if (!res.ok) throw new Error("Failed to delete event");

            setMessage("Event deleted.");
            setEvents((prev) => prev.filter((ev) => ev.id !== id));
        } catch (err) {
            setError((err as Error).message || "Failed to delete event");
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("adminRole");
        localStorage.removeItem("adminPermissions");
        router.push("/admin");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                <Loader2 className="animate-spin text-[#ffdc36]" />
            </div>
        );
    }

    const pendingPhotoCount = photoFilesRef.current.size;
    const hasPendingPhotoForMember = (memberId: string) => photoFilesRef.current.has(memberId);
    const visiblePermissionUsers = users.filter(
        (user) => !HIDDEN_PERMISSION_EDIT_EMAILS.has((user.email || "").toLowerCase())
    );

    return (
        <div className="min-h-screen bg-black text-white p-4 pt-28">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                    <div className="flex items-center gap-3">
                        <Users className="text-[#ffdc36]" />
                        <h1 className="text-2xl font-bold text-[#ffdc36]">Admin Dashboard</h1>
                    </div>
                    <div className="flex gap-2">
                        {canManageResetLinks && (
                            <button
                                type="button"
                                onClick={() => router.push("/admin/reset-links")}
                                className="px-4 py-2 rounded-lg border border-gray-700 hover:border-[#ffdc36] text-sm"
                            >
                                Send Reset Links
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={logout}
                            className="px-4 py-2 rounded-lg bg-red-700 hover:bg-red-600 text-sm font-semibold inline-flex items-center gap-2"
                        >
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                </div>

                <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-6 shadow-2xl">
                    <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-800 pb-4">
                        <button
                            type="button"
                            onClick={() => setActiveTab("committee")}
                            disabled={!canManageCommittee}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                                activeTab === "committee"
                                    ? "bg-[#ffdc36] text-black"
                                    : "bg-black border border-gray-700 text-gray-300 hover:border-[#ffdc36]"
                            } ${!canManageCommittee ? "opacity-40 cursor-not-allowed" : ""}`}
                        >
                            Committee
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("news")}
                            disabled={!canManageNews}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold inline-flex items-center gap-2 ${
                                activeTab === "news"
                                    ? "bg-[#ffdc36] text-black"
                                    : "bg-black border border-gray-700 text-gray-300 hover:border-[#ffdc36]"
                            } ${!canManageNews ? "opacity-40 cursor-not-allowed" : ""}`}
                        >
                            <Newspaper size={16} /> News
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("events")}
                            disabled={!canManageEvents}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold inline-flex items-center gap-2 ${
                                activeTab === "events"
                                    ? "bg-[#ffdc36] text-black"
                                    : "bg-black border border-gray-700 text-gray-300 hover:border-[#ffdc36]"
                            } ${!canManageEvents ? "opacity-40 cursor-not-allowed" : ""}`}
                        >
                            <Calendar size={16} /> Events
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("permissions")}
                            disabled={!canAccessPermissionsTab}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold inline-flex items-center gap-2 ${
                                activeTab === "permissions"
                                    ? "bg-[#ffdc36] text-black"
                                    : "bg-black border border-gray-700 text-gray-300 hover:border-[#ffdc36]"
                            } ${!canAccessPermissionsTab ? "opacity-40 cursor-not-allowed" : ""}`}
                        >
                            <Shield size={16} /> Permissions
                        </button>
                    </div>

                    {message && (
                        <div className="p-3 mb-4 bg-green-900/30 border border-green-800 text-green-400 rounded-lg text-sm">
                            {message}
                        </div>
                    )}
                    {error && (
                        <div className="p-3 mb-4 bg-red-900/30 border border-red-800 text-red-400 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {!canManageCommittee && !canManageNews && !canManageEvents && !canAccessPermissionsTab && (
                        <div className="p-3 mb-4 bg-red-900/30 border border-red-800 text-red-400 rounded-lg text-sm">
                            This account does not currently have management permissions for committee, news, events, or user permissions.
                        </div>
                    )}

                    {activeTab === "committee" && canManageCommittee && (
                        <div>
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-xl font-bold">Manage Committee</h2>
                                    {pendingPhotoCount > 0 && (
                                        <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300">
                                            {pendingPhotoCount} unsaved image change{pendingPhotoCount === 1 ? "" : "s"}
                                        </span>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={saveCommittee}
                                    disabled={savingCommittee}
                                    className="bg-[#ffdc36] text-black font-bold px-4 py-2 rounded-lg hover:bg-[#e6c229] transition disabled:opacity-50 inline-flex items-center gap-2"
                                >
                                    {savingCommittee ? (
                                        <Loader2 className="animate-spin" size={16} />
                                    ) : (
                                        <Save size={16} />
                                    )}
                                    {savingCommittee ? "Saving..." : "Save Changes"}
                                </button>
                            </div>

                            <div className="space-y-5">
                                {committee.map((member) => (
                                    <div
                                        key={member.id}
                                        className="bg-black/40 border border-gray-800 rounded-xl p-4 grid grid-cols-1 md:grid-cols-4 gap-4"
                                    >
                                        <div className="md:col-span-1">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                                Photo
                                            </label>
                                            {hasPendingPhotoForMember(member.id) && (
                                                <div className="text-xs mb-2 px-2.5 py-1 rounded-md bg-amber-500/20 border border-amber-400/40 text-amber-300 inline-block">
                                                    Unsaved crop/upload
                                                </div>
                                            )}
                                            <div className="w-full h-56 bg-gray-900 border border-gray-800 rounded-lg overflow-hidden relative mb-2">
                                                {member.photoUrl ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        src={member.photoUrl}
                                                        alt={member.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                        <Camera size={20} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <label className="flex-1 cursor-pointer">
                                                    <span className="block text-center px-3 py-2 rounded-lg border border-gray-700 hover:border-[#ffdc36] text-sm">
                                                        Upload New
                                                    </span>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0] ?? null;
                                                            handlePhotoSelect(member.id, file);
                                                            e.currentTarget.value = "";
                                                        }}
                                                    />
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => handleEditExistingPhoto(member)}
                                                    className="px-3 py-2 rounded-lg border border-gray-700 hover:border-[#ffdc36] text-sm"
                                                >
                                                    Edit Crop
                                                </button>
                                            </div>
                                        </div>
                                        <div className="md:col-span-3 space-y-3">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                                    Role
                                                </label>
                                                <div className="px-4 py-2.5 rounded-lg bg-gray-900/50 border border-gray-800 text-gray-300">
                                                    {member.role}
                                                </div>
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor={`member-name-${member.id}`}
                                                    className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5"
                                                >
                                                    Name
                                                </label>
                                                <input
                                                    id={`member-name-${member.id}`}
                                                    type="text"
                                                    value={member.name}
                                                    onChange={(e) =>
                                                        updateMember(member.id, {
                                                            name: e.target.value,
                                                        })
                                                    }
                                                    className="w-full px-4 py-2.5 rounded-lg bg-black border border-gray-800 text-white focus:border-[#ffdc36] focus:ring-1 focus:ring-[#ffdc36] outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor={`member-bio-${member.id}`}
                                                    className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5"
                                                >
                                                    Bio
                                                </label>
                                                <textarea
                                                    id={`member-bio-${member.id}`}
                                                    rows={4}
                                                    value={member.bio}
                                                    onChange={(e) =>
                                                        updateMember(member.id, {
                                                            bio: e.target.value,
                                                        })
                                                    }
                                                    className="w-full px-4 py-2.5 rounded-lg bg-black border border-gray-800 text-white focus:border-[#ffdc36] focus:ring-1 focus:ring-[#ffdc36] outline-none resize-y"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === "news" && canManageNews && (
                        <div>
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-xl font-bold">Manage News</h2>
                                <button
                                    type="button"
                                    onClick={openCreateNews}
                                    className="bg-[#ffdc36] text-black font-bold px-4 py-2 rounded-lg hover:bg-[#e6c229] transition inline-flex items-center gap-2"
                                >
                                    <Plus size={16} /> Add News
                                </button>
                            </div>

                            <div className="space-y-3">
                                {news.length === 0 && (
                                    <p className="text-gray-400 text-sm">No news articles found.</p>
                                )}
                                {news.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-black/40 border border-gray-800 rounded-xl p-4 flex items-start justify-between gap-3"
                                    >
                                        <div>
                                            <h3 className="font-semibold text-white">{item.title}</h3>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {item.author || "Unknown author"}
                                                {item.published_at
                                                    ? ` • ${new Date(item.published_at).toLocaleDateString()}`
                                                    : ""}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => openEditNews(item)}
                                                className="p-2 rounded-lg border border-gray-700 hover:border-[#ffdc36]"
                                                aria-label={`Edit news ${item.title}`}
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => deleteNews(item.id)}
                                                className="p-2 rounded-lg border border-red-900 text-red-300 hover:bg-red-950"
                                                aria-label={`Delete news ${item.title}`}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === "events" && canManageEvents && (
                        <div>
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-xl font-bold">Manage Events</h2>
                                <button
                                    type="button"
                                    onClick={openCreateEvent}
                                    className="bg-[#ffdc36] text-black font-bold px-4 py-2 rounded-lg hover:bg-[#e6c229] transition inline-flex items-center gap-2"
                                >
                                    <Plus size={16} /> Add Event
                                </button>
                            </div>

                            <div className="space-y-3">
                                {events.length === 0 && (
                                    <p className="text-gray-400 text-sm">No events found.</p>
                                )}
                                {events.map((event) => (
                                    <div
                                        key={event.id}
                                        className="bg-black/40 border border-gray-800 rounded-xl p-4 flex items-start justify-between gap-3"
                                    >
                                        <div>
                                            <h3 className="font-semibold text-white">{event.title}</h3>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {event.date || "No date"}
                                                {event.location ? ` • ${event.location}` : ""}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => openEditEvent(event)}
                                                className="p-2 rounded-lg border border-gray-700 hover:border-[#ffdc36]"
                                                aria-label={`Edit event ${event.title}`}
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => deleteEvent(event.id)}
                                                className="p-2 rounded-lg border border-red-900 text-red-300 hover:bg-red-950"
                                                aria-label={`Delete event ${event.title}`}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === "permissions" && canAccessPermissionsTab && (
                        <div>
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                                <div>
                                    <h2 className="text-xl font-bold">Manual Permission Overrides</h2>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Manual overrides let you assign custom permissions per user.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={fetchUsers}
                                    className="px-4 py-2 rounded-lg border border-gray-700 hover:border-[#ffdc36] text-sm"
                                >
                                    Refresh Users
                                </button>
                            </div>

                            {!canEditPermissionOverrides && (
                                <div className="p-3 mb-4 bg-amber-900/30 border border-amber-800 text-amber-300 rounded-lg text-sm">
                                    You can view overrides, but only accounts with ADMIN role can edit and save changes.
                                </div>
                            )}

                            {loadingUsers && (
                                <div className="flex items-center gap-2 text-gray-300 text-sm">
                                    <Loader2 className="animate-spin" size={16} /> Loading users...
                                </div>
                            )}

                            {!loadingUsers && visiblePermissionUsers.length === 0 && (
                                <p className="text-gray-400 text-sm">No users found.</p>
                            )}

                            <div className="space-y-4">
                                {visiblePermissionUsers.map((user) => {
                                    const draft = userPermissionDrafts[user.id] ?? {
                                        overrideEnabled: false,
                                        permissions: [],
                                        dirty: false,
                                    };

                                    const isSaving = savingUserId === user.id;

                                    return (
                                        <div
                                            key={user.id}
                                            className="bg-black/40 border border-gray-800 rounded-xl p-4"
                                        >
                                            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                                                <div>
                                                    <h3 className="font-semibold text-white">{user.email}</h3>
                                                    <p className="text-xs text-gray-400 mt-1">Role: {user.role || "Unknown"}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => saveUserPermissionOverride(user.id)}
                                                    disabled={isSaving || !draft.dirty || !canEditPermissionOverrides}
                                                    className="px-3 py-2 rounded-lg bg-[#ffdc36] text-black font-semibold hover:bg-[#e6c229] disabled:opacity-40 inline-flex items-center gap-2"
                                                >
                                                    {isSaving && <Loader2 className="animate-spin" size={14} />}
                                                    Save Override
                                                </button>
                                            </div>

                                            <label className="inline-flex items-center gap-2 text-sm text-gray-300 mb-3">
                                                <input
                                                    type="checkbox"
                                                    checked={draft.overrideEnabled}
                                                    onChange={(e) => setDraftOverrideEnabled(user.id, e.target.checked)}
                                                    disabled={!canEditPermissionOverrides}
                                                    className="h-4 w-4 accent-[#ffdc36]"
                                                />
                                                Enable manual override for this user
                                            </label>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                                {ALL_PERMISSIONS.map((permission) => (
                                                    <label
                                                        key={`${user.id}-${permission}`}
                                                        className={`inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg border ${
                                                            draft.overrideEnabled
                                                                ? "border-gray-700"
                                                                : "border-gray-800 opacity-60"
                                                        }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={draft.permissions.includes(permission)}
                                                            onChange={() => toggleDraftPermission(user.id, permission)}
                                                            disabled={!draft.overrideEnabled || !canEditPermissionOverrides}
                                                            className="h-4 w-4 accent-[#ffdc36]"
                                                        />
                                                        {PERMISSION_LABELS[permission]}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {newsModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 flex items-center justify-center">
                    <div className="w-full max-w-2xl bg-[#0f0f0f] border border-gray-800 rounded-xl shadow-2xl">
                        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                            <h3 className="font-bold text-lg">
                                {editingNewsId ? "Edit News" : "Add News"}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setNewsModalOpen(false)}
                                className="p-1 rounded hover:bg-gray-800"
                                aria-label="Close news editor"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={saveNews} className="p-6 space-y-4">
                            <div>
                                <label htmlFor="news-title" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                    Title
                                </label>
                                <input
                                    id="news-title"
                                    type="text"
                                    required
                                    value={newsDraft.title}
                                    onChange={(e) =>
                                        setNewsDraft((prev) => ({ ...prev, title: e.target.value }))
                                    }
                                    className="w-full px-4 py-2.5 rounded-lg bg-black border border-gray-800 text-white focus:border-[#ffdc36] outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="news-author" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                        Author
                                    </label>
                                    <input
                                        id="news-author"
                                        type="text"
                                        value={newsDraft.author}
                                        onChange={(e) =>
                                            setNewsDraft((prev) => ({ ...prev, author: e.target.value }))
                                        }
                                        className="w-full px-4 py-2.5 rounded-lg bg-black border border-gray-800 text-white focus:border-[#ffdc36] outline-none"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="news-date" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                        Publish Date
                                    </label>
                                    <input
                                        id="news-date"
                                        type="date"
                                        value={newsDraft.published_at}
                                        onChange={(e) =>
                                            setNewsDraft((prev) => ({ ...prev, published_at: e.target.value }))
                                        }
                                        className="w-full px-4 py-2.5 rounded-lg bg-black border border-gray-800 text-white focus:border-[#ffdc36] outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="news-image" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                    Image URL
                                </label>
                                <input
                                    id="news-image"
                                    type="url"
                                    value={newsDraft.image_url}
                                    onChange={(e) =>
                                        setNewsDraft((prev) => ({ ...prev, image_url: e.target.value }))
                                    }
                                    className="w-full px-4 py-2.5 rounded-lg bg-black border border-gray-800 text-white focus:border-[#ffdc36] outline-none"
                                />
                            </div>

                            <div>
                                <label htmlFor="news-body" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                    Body
                                </label>
                                <textarea
                                    id="news-body"
                                    rows={7}
                                    value={newsDraft.body}
                                    onChange={(e) =>
                                        setNewsDraft((prev) => ({ ...prev, body: e.target.value }))
                                    }
                                    className="w-full px-4 py-2.5 rounded-lg bg-black border border-gray-800 text-white focus:border-[#ffdc36] outline-none"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setNewsModalOpen(false)}
                                    className="px-4 py-2 rounded-lg border border-gray-700 hover:border-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={savingNews}
                                    className="px-4 py-2 rounded-lg bg-[#ffdc36] text-black font-bold hover:bg-[#e6c229] disabled:opacity-50 inline-flex items-center gap-2"
                                >
                                    {savingNews && <Loader2 className="animate-spin" size={16} />}
                                    {savingNews ? "Saving..." : "Save News"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {eventModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 flex items-center justify-center">
                    <div className="w-full max-w-2xl bg-[#0f0f0f] border border-gray-800 rounded-xl shadow-2xl">
                        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                            <h3 className="font-bold text-lg">
                                {editingEventId ? "Edit Event" : "Add Event"}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setEventModalOpen(false)}
                                className="p-1 rounded hover:bg-gray-800"
                                aria-label="Close event editor"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={saveEvent} className="p-6 space-y-4">
                            <div>
                                <label htmlFor="event-title" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                    Title
                                </label>
                                <input
                                    id="event-title"
                                    type="text"
                                    required
                                    value={eventDraft.title}
                                    onChange={(e) =>
                                        setEventDraft((prev) => ({ ...prev, title: e.target.value }))
                                    }
                                    className="w-full px-4 py-2.5 rounded-lg bg-black border border-gray-800 text-white focus:border-[#ffdc36] outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="event-type" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                        Type
                                    </label>
                                    <input
                                        id="event-type"
                                        type="text"
                                        value={eventDraft.type}
                                        onChange={(e) =>
                                            setEventDraft((prev) => ({ ...prev, type: e.target.value }))
                                        }
                                        className="w-full px-4 py-2.5 rounded-lg bg-black border border-gray-800 text-white focus:border-[#ffdc36] outline-none"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="event-location" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                        Location
                                    </label>
                                    <input
                                        id="event-location"
                                        type="text"
                                        value={eventDraft.location}
                                        onChange={(e) =>
                                            setEventDraft((prev) => ({ ...prev, location: e.target.value }))
                                        }
                                        className="w-full px-4 py-2.5 rounded-lg bg-black border border-gray-800 text-white focus:border-[#ffdc36] outline-none"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="event-date" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                        Start Date
                                    </label>
                                    <input
                                        id="event-date"
                                        type="date"
                                        value={eventDraft.date}
                                        onChange={(e) =>
                                            setEventDraft((prev) => ({ ...prev, date: e.target.value }))
                                        }
                                        className="w-full px-4 py-2.5 rounded-lg bg-black border border-gray-800 text-white focus:border-[#ffdc36] outline-none"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="event-end-date" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                        End Date
                                    </label>
                                    <input
                                        id="event-end-date"
                                        type="date"
                                        value={eventDraft.endDate}
                                        onChange={(e) =>
                                            setEventDraft((prev) => ({ ...prev, endDate: e.target.value }))
                                        }
                                        className="w-full px-4 py-2.5 rounded-lg bg-black border border-gray-800 text-white focus:border-[#ffdc36] outline-none"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="event-time" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                        Time
                                    </label>
                                    <input
                                        id="event-time"
                                        type="text"
                                        value={eventDraft.time}
                                        onChange={(e) =>
                                            setEventDraft((prev) => ({ ...prev, time: e.target.value }))
                                        }
                                        className="w-full px-4 py-2.5 rounded-lg bg-black border border-gray-800 text-white focus:border-[#ffdc36] outline-none"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <label className="inline-flex items-center gap-2 text-sm text-gray-300">
                                        <input
                                            type="checkbox"
                                            checked={eventDraft.featured}
                                            onChange={(e) =>
                                                setEventDraft((prev) => ({
                                                    ...prev,
                                                    featured: e.target.checked,
                                                }))
                                            }
                                            className="h-4 w-4 accent-[#ffdc36]"
                                        />
                                        Featured Event
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="event-description" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                    Description
                                </label>
                                <textarea
                                    id="event-description"
                                    rows={6}
                                    value={eventDraft.description}
                                    onChange={(e) =>
                                        setEventDraft((prev) => ({ ...prev, description: e.target.value }))
                                    }
                                    className="w-full px-4 py-2.5 rounded-lg bg-black border border-gray-800 text-white focus:border-[#ffdc36] outline-none"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setEventModalOpen(false)}
                                    className="px-4 py-2 rounded-lg border border-gray-700 hover:border-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={savingEvent}
                                    className="px-4 py-2 rounded-lg bg-[#ffdc36] text-black font-bold hover:bg-[#e6c229] disabled:opacity-50 inline-flex items-center gap-2"
                                >
                                    {savingEvent && <Loader2 className="animate-spin" size={16} />}
                                    {savingEvent ? "Saving..." : "Save Event"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <CommitteePhotoCropModal
                isOpen={cropModalOpen}
                imageSrc={cropSourceUrl}
                fileName={cropSourceFileName}
                onCancel={closeCropModal}
                onConfirm={handleCropConfirm}
            />
        </div>
    );
}
