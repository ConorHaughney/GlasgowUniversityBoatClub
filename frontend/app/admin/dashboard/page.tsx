"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
    LogOut,
    UserCog,
    Users,
    Newspaper,
    Calendar,
    ShoppingBag,
    Loader2,
    Save,
    Camera,
    Plus,
    Trash2,
    Edit,
    X,
    Clock,
    MapPin,
    Package,
    CheckCircle,
    AlertCircle,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

interface User {
    id: number;
    email: string;
    role: string;
}

interface CommitteeMember {
    id: string;
    role: string; // read-only, from backend
    name: string;
    bio: string;
    photoUrl: string;
}

interface CommitteeMemberResponse {
    id: number;
    role: string;
    name: string;
    bio: string;
    image_url: string;
    email: string;
}

interface EventItem {
    id: number;
    title: string;
    date: string;
    endDate?: string;
    location: string;
    time: string;
    type: string;
    description: string;
    featured: boolean;
}

interface NewsItem {
    id: number;
    title: string;
    body: string;
    image_url: string;
    author: string;
    published_at: string;
}

interface MerchItem {
    id: number;
    name: string;
    price: number; // pence
    description?: string;
    image_url?: string;
}

interface OrderItem {
    id: number;
    productName: string;
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    customerName: string;
    customerEmail: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    items: OrderItem[];
    shippingLine1?: string;
    shippingLine2?: string;
    shippingCity?: string;
    shippingPostalCode?: string;
    shippingCountry?: string;
}

type TabType = "committee" | "users" | "news" | "events" | "merch";

export default function AdminDashboard() {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState<TabType>("committee");

    const [users, setUsers] = useState<User[]>([]);
    const [committee, setCommittee] = useState<CommitteeMember[]>([]);
    const [savingCommittee, setSavingCommittee] = useState(false);

    const [events, setEvents] = useState<EventItem[]>([]);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState<Partial<EventItem>>({});
    const [savingEvent, setSavingEvent] = useState(false);

    const [news, setNews] = useState<NewsItem[]>([]);
    const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
    const [currentNews, setCurrentNews] = useState<Partial<NewsItem>>({});
    const [savingNews, setSavingNews] = useState(false);
    const [newsImageFile, setNewsImageFile] = useState<File | null>(null);

    const [merch, setMerch] = useState<MerchItem[]>([]);
    const [isMerchModalOpen, setIsMerchModalOpen] = useState(false);
    const [currentMerch, setCurrentMerch] = useState<Partial<MerchItem>>({});
    const [savingMerch, setSavingMerch] = useState(false);
    const [merchImageFile, setMerchImageFile] = useState<File | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [merchView, setMerchView] = useState<"items" | "orders">("items");

    const photoFilesRef = useRef<Map<string, File>>(new Map()); // key by member.id

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            router.push("/admin");
            return;
        }
        // Autofill from backend
        Promise.all([
            fetchUsers(storedToken),
            fetchCommittee(storedToken),
            fetchEvents(),
            fetchNews(),
            fetchMerch(),
            fetchOrders(storedToken),
        ]).finally(() => setLoading(false));
    }, [router]);

    const fetchUsers = async (jwt: string) => {
        try {
            const res = await fetch(`${API_URL}/api/users`, {
                headers: { Authorization: `Bearer ${jwt}` },
            });
            if (!res.ok) throw new Error("Failed to fetch users");
            const data: User[] = await res.json();
            setUsers(data);
        } catch {
            setError("Could not load users");
        }
    };

    const fetchCommittee = async (jwt: string) => {
        try {
            const res = await fetch(`${API_URL}/api/committee`, {
                headers: { Authorization: `Bearer ${jwt}` },
            });
            if (!res.ok) throw new Error("Failed to fetch committee");

            const text = await res.text();
            const raw = text ? JSON.parse(text) : [];
            const data = Array.isArray(raw)
                ? raw.map((m: CommitteeMemberResponse) => ({
                    id: String(m.id),
                    role: m.role,
                    name: m.name,
                    bio: m.bio,
                    photoUrl: m.image_url,
                }))
                : [];
            setCommittee(data);
        } catch (err) {
            setError("Could not load committee");
            console.error(err);
        }
    };

    const fetchEvents = async () => {
        try {
            const res = await fetch(`${API_URL}/api/events`);
            if (!res.ok) throw new Error("Failed to fetch events");
            const data = await res.json();
            data.sort(
                (a: EventItem, b: EventItem) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
            );
            setEvents(data);
        } catch {
            console.error("Could not load events");
        }
    };

    const fetchNews = async () => {
        try {
            const res = await fetch(`${API_URL}/api/news`);
            if (!res.ok) throw new Error("Failed to fetch news");
            const data = await res.json();
            const newsData = Array.isArray(data) ? data : [];
            newsData.sort(
                (a: NewsItem, b: NewsItem) =>
                    new Date(b.published_at).getTime() -
                    new Date(a.published_at).getTime()
            );
            setNews(newsData);
        } catch {
            console.error("Could not load news");
        }
    };

    const fetchMerch = async () => {
        try {
            const res = await fetch(`${API_URL}/api/merch`);
            if (!res.ok) throw new Error("Failed to fetch merch");
            const data = await res.json();
            setMerch(data);
        } catch {
            console.error("Could not load merch");
        }
    };

    const fetchOrders = async (jwt: string) => {
        try {
            const res = await fetch(`${API_URL}/api/admin/orders`, {
                headers: { Authorization: `Bearer ${jwt}` },
            });
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch {
            console.error("Could not load orders");
        }
    };

    const handleShipOrder = async (id: number) => {
        const jwt = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_URL}/api/admin/orders/${id}/ship`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${jwt}` },
            });
            if (res.ok) fetchOrders(jwt!);
        } catch {
            alert("Failed to update order status");
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        router.push("/admin");
    };

    const updateMember = (id: string, patch: Partial<CommitteeMember>) => {
        setCommittee((prev) =>
            prev.map((m) => (m.id === id ? { ...m, ...patch } : m))
        );
    };

    const handlePhotoSelect = (id: string, file: File | null) => {
        if (!file) return;
        const previewUrl = URL.createObjectURL(file);
        updateMember(id, { photoUrl: previewUrl });
        photoFilesRef.current.set(id, file);
    };

    const saveCommittee = async () => {
        setSavingCommittee(true);
        setError("");
        try {
            const jwt = localStorage.getItem("token") || "";

            // Save names and bios in bulk (roles unchanged)
            const resDetails = await fetch(`${API_URL}/api/admin/committee`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
                body: JSON.stringify({
                    members: committee.map(({ id, name, bio }) => ({ id, name, bio })),
                }),
            });
            if (!resDetails.ok) throw new Error("Failed to save committee details");

            // Upload changed photos (only those selected)
            for (const [id, file] of photoFilesRef.current.entries()) {
                const form = new FormData();
                form.append("file", file);
                form.append("id", id);
                const resPhoto = await fetch(`${API_URL}/api/admin/committee/photo`, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${jwt}` },
                    body: form,
                });
                if (!resPhoto.ok)
                    throw new Error(`Failed to upload photo for member ${id}`);
            }

            photoFilesRef.current.clear();
            await fetchCommittee(jwt);
        } catch (err) {
            setError((err as Error).message || "Failed to save committee");
        } finally {
            setSavingCommittee(false);
        }
    };

    const handleSaveEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingEvent(true);
        const jwt = localStorage.getItem("token");
        try {
            const method = currentEvent.id ? "PUT" : "POST";
            const url = currentEvent.id
                ? `${API_URL}/api/events/${currentEvent.id}`
                : `${API_URL}/api/events`;

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
                body: JSON.stringify(currentEvent),
            });

            if (!res.ok) throw new Error("Failed to save event");

            await fetchEvents();
            setIsEventModalOpen(false);
            setCurrentEvent({});
        } catch (err) {
            setError("Failed to save event");
        } finally {
            setSavingEvent(false);
        }
    };

    const handleDeleteEvent = async (id: number) => {
        if (!confirm("Are you sure you want to delete this event?")) return;
        const jwt = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_URL}/api/events/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${jwt}` },
            });
            if (!res.ok) throw new Error("Failed to delete event");
            setEvents((prev) => prev.filter((e) => e.id !== id));
        } catch (err) {
            setError("Failed to delete event");
        }
    };

    const handleSaveNews = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingNews(true);
        const jwt = localStorage.getItem("token");
        try {
            let imageUrl = currentNews.image_url;

            if (newsImageFile) {
                const formData = new FormData();
                formData.append("file", newsImageFile);
                const uploadRes = await fetch(`${API_URL}/api/admin/news/image`, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${jwt}` },
                    body: formData,
                });
                if (!uploadRes.ok) {
                    const errorText = await uploadRes.text();
                    console.error("Image upload failed:", errorText);
                    throw new Error("Failed to upload image: " + errorText);
                }
                imageUrl = await uploadRes.text();
            }

            const method = currentNews.id ? "PUT" : "POST";
            const url = currentNews.id
                ? `${API_URL}/api/news/${currentNews.id}`
                : `${API_URL}/api/news`;

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
                body: JSON.stringify({ ...currentNews, image_url: imageUrl || null }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error(`Failed to save news (${res.status}):`, errorText);
                throw new Error("Failed to save news");
            }

            await fetchNews();
            setIsNewsModalOpen(false);
            setCurrentNews({});
            setNewsImageFile(null);
        } catch (err) {
            console.error(err);
            setError("Failed to save news");
        } finally {
            setSavingNews(false);
        }
    };

    const handleDeleteNews = async (id: number) => {
        if (!confirm("Are you sure you want to delete this article?")) return;
        const jwt = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_URL}/api/news/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${jwt}` },
            });
            if (!res.ok) throw new Error("Failed to delete article");
            setNews((prev) => prev.filter((n) => n.id !== id));
        } catch (err) {
            setError("Failed to delete article");
        }
    };

    const handleSaveMerch = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingMerch(true);
        const jwt = localStorage.getItem("token");
        try {
            let imageUrl = currentMerch.image_url;

            if (merchImageFile) {
                const formData = new FormData();
                formData.append("file", merchImageFile);
                const uploadRes = await fetch(`${API_URL}/api/admin/merch/image`, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${jwt}` },
                    body: formData,
                });
                if (!uploadRes.ok) {
                    const errorText = await uploadRes.text();
                    throw new Error("Failed to upload image: " + errorText);
                }
                imageUrl = await uploadRes.text();
            }

            const method = currentMerch.id ? "PUT" : "POST";
            const url = currentMerch.id
                ? `${API_URL}/api/merch/${currentMerch.id}`
                : `${API_URL}/api/merch`;

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
                body: JSON.stringify({ ...currentMerch, image_url: imageUrl || null }),
            });

            if (!res.ok) throw new Error("Failed to save merch item");

            await fetchMerch();
            setIsMerchModalOpen(false);
            setCurrentMerch({});
            setMerchImageFile(null);
        } catch (err) {
            setError("Failed to save merch item");
        } finally {
            setSavingMerch(false);
        }
    };

    const handleDeleteMerch = async (id: number) => {
        if (!confirm("Are you sure you want to delete this item?")) return;
        const jwt = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_URL}/api/merch/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${jwt}` },
            });
            if (!res.ok) throw new Error("Failed to delete item");
            setMerch((prev) => prev.filter((m) => m.id !== id));
        } catch (err) {
            setError("Failed to delete item");
        }
    };

    const tabs = [
        { id: "committee", label: "Committee", icon: UserCog },
        { id: "users", label: "Users", icon: Users },
        { id: "news", label: "News", icon: Newspaper },
        { id: "events", label: "Events", icon: Calendar },
        { id: "merch", label: "Merch", icon: ShoppingBag },
    ] as const;

    if (loading)
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#ffdc36]" />
            </div>
        );

    return (
        <div className="min-h-screen bg-black text-white pt-32 px-4 pb-12 ">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#ffdc36]">
                        Admin Dashboard
                    </h1>
                    <button
                        type="button"
                        onClick={logout}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition shadow-sm"
                        aria-label="Log out"
                    >
                        <LogOut size={18} aria-hidden="true" />
                        <span>Logout</span>
                    </button>
                </div>

                {error && (
                    <p role="alert" className="text-red-400 mb-4">
                        {error}
                    </p>
                )}

                <div
                    className="flex flex-wrap gap-2 mb-8"
                    role="tablist"
                    aria-label="Dashboard sections"
                >
                    {tabs.map((tab) => (
                        <button
                            type="button"
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as TabType)}
                            role="tab"
                            aria-selected={activeTab === tab.id ? "true" : "false"}
                            aria-controls={`panel-${tab.id}`}
                            id={`tab-${tab.id}`}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === tab.id
                                ? "bg-[#ffdc36] text-black shadow-md transform scale-105"
                                : "bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-[#2a2a2a]"
                                }`}
                        >
                            <tab.icon size={18} aria-hidden="true" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div
                    className="bg-[#0f0f0f] border border-[#ffdc36] rounded-lg p-6"
                    role="tabpanel"
                    id={`panel-${activeTab}`}
                    aria-labelledby={`tab-${activeTab}`}
                >
                    {activeTab === "committee" && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold">Manage Committee</h2>
                                {committee.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={saveCommittee}
                                        disabled={savingCommittee}
                                        className="flex items-center gap-2 bg-[#ffdc36] text-black font-bold px-4 py-2 rounded-lg hover:bg-[#e6c229] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-900/20"
                                    >
                                        {savingCommittee ? (
                                            <Loader2 className="animate-spin" size={18} />
                                        ) : (
                                            <Save size={18} />
                                        )}
                                        <span>
                                            {savingCommittee ? "Saving..." : "Save Changes"}
                                        </span>
                                    </button>
                                )}
                            </div>
                            {committee.length === 0 ? (
                                <p className="text-gray-400">No committee data found</p>
                            ) : (
                                <div className="grid grid-cols-1 gap-6">
                                    {committee.map((member) => (
                                        <div
                                            key={member.id}
                                            className="bg-white/5 border border-gray-800 rounded-xl flex flex-col md:flex-row-reverse overflow-hidden hover:border-gray-600 transition-colors"
                                        >
                                            {/* Photo Section */}
                                            <div className="flex-shrink-0 w-full md:w-84 h-72 md:h-86 relative border-b md:border-b-0 border-gray-800 overflow-hidden">
                                                <label
                                                    className="block w-full h-full cursor-pointer group bg-gray-900"
                                                    aria-label={`Change photo for ${member.name}`}
                                                >
                                                    {member.photoUrl ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img
                                                            src={member.photoUrl}
                                                            alt={`${member.role} - ${member.name}`}
                                                            className="w-full h-full object-cover transition-transform duration-300 "
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-2">
                                                            <Camera size={24} />
                                                            <span className="text-xs font-medium uppercase">
                                                                Upload
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 border-4 border-dashed border-[#ffdc36] rounded-r-xl">
                                                        <Camera className="text-[#ffdc36] mb-1" size={24} />
                                                        <span className="text-[10px] text-white font-bold uppercase tracking-wider">
                                                            Change Photo
                                                        </span>
                                                    </div>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0] ?? null;
                                                            handlePhotoSelect(member.id, file);
                                                            e.target.value = "";
                                                        }}
                                                        aria-label={`Upload photo for ${member.name}`}
                                                        title={`Upload photo for ${member.name}`}
                                                    />
                                                </label>
                                            </div>

                                            <div className="flex-grow p-6 space-y-4 md:border-r border-gray-800">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                                        Role
                                                    </label>
                                                    <div className="w-full px-4 py-2.5 rounded-lg bg-gray-900/50 border border-gray-800 text-gray-400 font-medium">
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
                                                            updateMember(member.id, { name: e.target.value })
                                                        }
                                                        placeholder="Name"
                                                        className="w-full px-4 py-2.5 rounded-lg bg-black border border-gray-800 text-white focus:border-[#ffdc36] focus:ring-1 focus:ring-[#ffdc36] outline-none transition-all placeholder-gray-700"
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
                                                        value={member.bio}
                                                        onChange={(e) =>
                                                            updateMember(member.id, { bio: e.target.value })
                                                        }
                                                        placeholder="Enter bio..."
                                                        rows={3}
                                                        className="w-full px-4 py-2.5 rounded-lg bg-black border border-gray-800 text-white focus:border-[#ffdc36] focus:ring-1 focus:ring-[#ffdc36] outline-none transition-all placeholder-gray-700 resize-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "users" && (
                        <div>
                            <h2 className="text-2xl font-semibold mb-6">Registered Users</h2>
                            {users.length === 0 ? (
                                <div className="text-center py-12 bg-gray-900/30 rounded-xl border-2 border-dashed border-gray-800">
                                    <p className="text-gray-400">No users found</p>
                                </div>
                            ) : (
                                <div className="overflow-hidden rounded-xl border border-gray-800">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-900 border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                                                <th className="px-6 py-4 font-semibold">Email</th>
                                                <th className="px-6 py-4 font-semibold">Role</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-800">
                                            {users.map((user) => (
                                                <tr
                                                    key={user.id}
                                                    className="hover:bg-gray-900/50 transition-colors"
                                                >
                                                    <td className="px-6 py-4 text-gray-300">
                                                        {user.email}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400 border border-blue-800">
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "news" && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold">Manage News</h2>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCurrentNews({
                                            published_at: new Date().toISOString().split("T")[0],
                                        });
                                        setNewsImageFile(null);
                                        setIsNewsModalOpen(true);
                                    }}
                                    className="flex items-center gap-2 bg-[#ffdc36] text-black font-bold px-4 py-2 rounded-lg hover:bg-[#e6c229] transition shadow-lg shadow-yellow-900/20"
                                >
                                    <Plus size={18} aria-hidden="true" />
                                    <span>Add Article</span>
                                </button>
                            </div>

                            {news.length === 0 ? (
                                <p className="text-gray-400">No news articles found</p>
                            ) : (
                                <div className="grid gap-4">
                                    {news.map((item) => (
                                        <div
                                            key={item.id}
                                            className="bg-white/5 border border-gray-800 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-gray-600 transition-colors"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-bold text-white line-clamp-1">
                                                        {item.title}
                                                    </h3>
                                                    {item.author && (
                                                        <span className="px-2 py-0.5 text-xs uppercase tracking-wider rounded-full border border-gray-600 text-gray-400">
                                                            {item.author}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-gray-400 text-sm flex flex-wrap gap-4 mb-2">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar size={14} />
                                                        {new Date(item.published_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-gray-500 text-sm line-clamp-2">
                                                    {item.body}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setCurrentNews(item);
                                                        setNewsImageFile(null);
                                                        setIsNewsModalOpen(true);
                                                    }}
                                                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"
                                                    aria-label={`Edit article ${item.title}`}
                                                >
                                                    <Edit size={20} aria-hidden="true" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteNews(item.id)}
                                                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition"
                                                    aria-label={`Delete article ${item.title}`}
                                                >
                                                    <Trash2 size={20} aria-hidden="true" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "events" && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold">Manage Events</h2>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCurrentEvent({ type: "Competition", featured: false });
                                        setIsEventModalOpen(true);
                                    }}
                                    className="flex items-center gap-2 bg-[#ffdc36] text-black font-bold px-4 py-2 rounded-lg hover:bg-[#e6c229] transition shadow-lg shadow-yellow-900/20"
                                >
                                    <Plus size={18} aria-hidden="true" />
                                    <span>Add Event</span>
                                </button>
                            </div>

                            {events.length === 0 ? (
                                <p className="text-gray-400">No events found</p>
                            ) : (
                                <div className="grid gap-4">
                                    {events.map((event) => (
                                        <div
                                            key={event.id}
                                            className="bg-white/5 border border-gray-800 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-gray-600 transition-colors"
                                        >
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-bold text-white">
                                                        {event.title}
                                                    </h3>
                                                    <span
                                                        className={`px-2 py-0.5 text-xs uppercase tracking-wider rounded-full border ${event.type === "Competition"
                                                            ? "border-[#ffdc36] text-[#ffdc36]"
                                                            : event.type === "Social"
                                                                ? "border-purple-400 text-purple-400"
                                                                : "border-blue-400 text-blue-400"
                                                            }`}
                                                    >
                                                        {event.type}
                                                    </span>
                                                    {event.featured && (
                                                        <span className="px-2 py-0.5 text-xs uppercase tracking-wider rounded-full bg-[#ffdc36] text-black font-bold">
                                                            Featured
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-gray-400 text-sm flex flex-wrap gap-4">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar size={14} />
                                                        {event.date}{" "}
                                                        {event.endDate && ` - ${event.endDate}`}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={14} />
                                                        {event.time}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <MapPin size={14} />
                                                        {event.location}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setCurrentEvent(event);
                                                        setIsEventModalOpen(true);
                                                    }}
                                                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"
                                                    aria-label={`Edit event ${event.title}`}
                                                >
                                                    <Edit size={20} aria-hidden="true" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteEvent(event.id)}
                                                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition"
                                                    aria-label={`Delete event ${event.title}`}
                                                >
                                                    <Trash2 size={20} aria-hidden="true" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "merch" && (
                        <div>
                            <div className="flex gap-4 mb-6 border-b border-gray-800 pb-4">
                                <button
                                    onClick={() => setMerchView("items")}
                                    className={`px-4 py-2 rounded-lg font-medium transition ${merchView === "items"
                                        ? "bg-white text-black"
                                        : "text-gray-400 hover:text-white"
                                        }`}
                                >
                                    Items
                                </button>
                                <button
                                    onClick={() => setMerchView("orders")}
                                    className={`px-4 py-2 rounded-lg font-medium transition ${merchView === "orders"
                                        ? "bg-white text-black"
                                        : "text-gray-400 hover:text-white"
                                        }`}
                                >
                                    Orders
                                </button>
                            </div>

                            {merchView === "items" ? (
                                <>
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-semibold">
                                            Manage Merch Items
                                        </h2>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setCurrentMerch({});
                                                setMerchImageFile(null);
                                                setIsMerchModalOpen(true);
                                            }}
                                            className="flex items-center gap-2 bg-[#ffdc36] text-black font-bold px-4 py-2 rounded-lg hover:bg-[#e6c229] transition shadow-lg shadow-yellow-900/20"
                                        >
                                            <Plus size={18} aria-hidden="true" />
                                            <span>Add Item</span>
                                        </button>
                                    </div>

                                    {merch.length === 0 ? (
                                        <p className="text-gray-400">No merch items found</p>
                                    ) : (
                                        <div className="grid gap-4">
                                            {merch.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="bg-white/5 border border-gray-800 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-4 hover:border-gray-600 transition-colors"
                                                >
                                                    <div>
                                                        <h3 className="text-xl font-bold text-white">
                                                            {item.name}
                                                        </h3>
                                                        <p className="text-[#ffdc36] font-mono">
                                                            £{(item.price / 100).toFixed(2)}
                                                        </p>
                                                        {item.description && (
                                                            <p className="text-gray-400 text-sm mt-1">
                                                                {item.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setCurrentMerch(item);
                                                                setMerchImageFile(null);
                                                                setIsMerchModalOpen(true);
                                                            }}
                                                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"
                                                            aria-label={`Edit merch item ${item.name}`}
                                                        >
                                                            <Edit size={20} aria-hidden="true" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteMerch(item.id)}
                                                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition"
                                                            aria-label={`Delete merch item ${item.name}`}
                                                        >
                                                            <Trash2 size={20} aria-hidden="true" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <h2 className="text-2xl font-semibold mb-6">Orders</h2>
                                    <div className="space-y-4">
                                        {orders.length === 0 ? (
                                            <p className="text-gray-400">No orders found.</p>
                                        ) : (
                                            orders.map((order) => (
                                                <div
                                                    key={order.id}
                                                    className="bg-white/5 border border-gray-800 rounded-xl p-6"
                                                >
                                                    <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                                                        <div>
                                                            <div className="flex items-center gap-3 mb-1">
                                                                <h3 className="text-lg font-bold text-white">
                                                                    {order.customerName}
                                                                </h3>
                                                                <span
                                                                    className={`px-2 py-0.5 text-xs font-bold rounded-full ${order.status === "PAID"
                                                                        ? "bg-green-900 text-green-300"
                                                                        : order.status === "SHIPPED"
                                                                            ? "bg-blue-900 text-blue-300"
                                                                            : order.status === "DISPUTED"
                                                                                ? "bg-red-900 text-red-300"
                                                                                : order.status === "REFUNDED"
                                                                                    ? "bg-orange-900 text-orange-300"
                                                                                    : "bg-gray-800 text-gray-400"
                                                                        }`}
                                                                >
                                                                    {order.status}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-400">
                                                                {order.customerEmail}
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {new Date(order.createdAt).toLocaleDateString()}{" "}
                                                                at{" "}
                                                                {new Date(order.createdAt).toLocaleTimeString()}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xl font-bold text-[#ffdc36]">
                                                                £{(order.totalAmount / 100).toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="bg-black/30 rounded-lg p-4 mb-4">
                                                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                                            Items
                                                        </h4>
                                                        <ul className="space-y-1 text-sm text-gray-300">
                                                            {order.items.map((item) => (
                                                                <li
                                                                    key={item.id}
                                                                    className="flex justify-between"
                                                                >
                                                                    <span>
                                                                        {item.quantity}x {item.productName}
                                                                    </span>
                                                                    <span>£{(item.price / 100).toFixed(2)}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    <div className="flex justify-between items-end">
                                                        <div className="text-sm text-gray-400">
                                                            <p className="font-bold text-gray-500 uppercase text-xs mb-1">
                                                                Shipping Address
                                                            </p>
                                                            <p>{order.shippingLine1}</p>
                                                            {order.shippingLine2 && (
                                                                <p>{order.shippingLine2}</p>
                                                            )}
                                                            <p>
                                                                {[
                                                                    order.shippingCity,
                                                                    order.shippingPostalCode,
                                                                    order.shippingCountry,
                                                                ]
                                                                    .filter(Boolean)
                                                                    .join(", ")}
                                                            </p>
                                                        </div>
                                                        {order.status === "PAID" && (
                                                            <button
                                                                onClick={() => handleShipOrder(order.id)}
                                                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition text-sm font-medium"
                                                            >
                                                                <Package size={16} />
                                                                Mark as Shipped
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {isMerchModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center p-6 border-b border-gray-800">
                            <h3 className="text-xl font-bold text-white">
                                {currentMerch.id ? "Edit Item" : "Add New Item"}
                            </h3>
                            <button
                                onClick={() => setIsMerchModalOpen(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSaveMerch} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={currentMerch.name || ""}
                                    onChange={(e) =>
                                        setCurrentMerch({ ...currentMerch, name: e.target.value })
                                    }
                                    className="w-full px-4 py-2.5 rounded-lg bg-black border border-gray-800 text-white focus:border-[#ffdc36] outline-none"
                                    placeholder="Enter item name"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                    Price (Pence)
                                </label>
                                <input
                                    type="number"
                                    required
                                    placeholder="e.g. 3500 for £35.00"
                                    value={currentMerch.price || ""}
                                    onChange={(e) =>
                                        setCurrentMerch({
                                            ...currentMerch,
                                            price: parseInt(e.target.value),
                                        })
                                    }
                                    className="w-full px-4 py-2.5 rounded-lg bg-black border border-gray-800 text-white focus:border-[#ffdc36] outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                    Image
                                </label>
                                <div className="flex items-center gap-4">
                                    <div className="relative w-20 h-20 bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
                                        {merchImageFile ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={URL.createObjectURL(merchImageFile)}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : currentMerch.image_url ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={currentMerch.image_url}
                                                alt="Current"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-600">
                                                <Camera size={20} />
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            setMerchImageFile(e.target.files?.[0] || null)
                                        }
                                        className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#ffdc36] file:text-black hover:file:bg-[#e6c229] transition"
                                        aria-label="Upload merch item image"
                                        title="Upload merch item image"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                    Description
                                </label>
                                <textarea
                                    rows={3}
                                    value={currentMerch.description || ""}
                                    onChange={(e) =>
                                        setCurrentMerch({
                                            ...currentMerch,
                                            description: e.target.value,
                                        })
                                    }
                                    placeholder="Enter item description"
                                    title="Enter item description"
                                    className="w-full px-4 py-2.5 rounded-lg bg-black border border-gray-800 text-white focus:border-[#ffdc36] outline-none resize-none"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                                <button
                                    type="button"
                                    onClick={() => setIsMerchModalOpen(false)}
                                    className="px-6 py-2 rounded-lg font-medium text-gray-400 hover:text-white hover:bg-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={savingMerch}
                                    className="px-6 py-2 rounded-lg font-bold bg-[#ffdc36] text-black hover:bg-[#e6c229] flex items-center gap-2"
                                >
                                    {savingMerch && (
                                        <Loader2 className="animate-spin" size={18} />
                                    )}
                                    {savingMerch ? "Saving..." : "Save Item"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isEventModalOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex justify-between items-center p-6 border-b border-gray-800 sticky top-0 bg-[#0f0f0f] z-10">
                            <h3 id="modal-title" className="text-xl font-bold text-white">
                                {currentEvent.id ? "Edit Event" : "Add New Event"}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsEventModalOpen(false)}
                                className="text-gray-400 hover:text-white transition"
                                aria-label="Close modal"
                            >
                                <X size={24} aria-hidden="true" />
                            </button>
                        </div>
                        <form onSubmit={handleSaveEvent} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label
                                        htmlFor="event-title"
                                        className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5"
                                    >
                                        Title
                                    </label>
                                    <input
                                        id="event-title"
                                        type="text"
                                        required
                                        placeholder="Enter event title"
                                        value={currentEvent.title || ""}
                                        onChange={(e) =>
                                            setCurrentEvent({
                                                ...currentEvent,
                                                title: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2.5 rounded-lg bg-black border border-gray-800 text-white focus:border-[#ffdc36] focus:ring-1 focus:ring-[#ffdc36] outline-none"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="event-type"
                                        className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5"
                                    >
                                        Type
                                    </label>
                                    <select
                                        id="event-type"
                                        value={currentEvent.type || "Competition"}
                                        onChange={(e) =>
                                            setCurrentEvent({ ...currentEvent, type: e.target.value })
                                        }
                                        className="w-full px-4 py-2.5 rounded-lg bg-black border border-gray-800 text-white focus:border-[#ffdc36] focus:ring-1 focus:ring-[#ffdc36] outline-none"
                                    >
                                        <option value="Competition">Competition</option>
                                        <option value="Social">Social</option>
                                        <option value="Recruitment">Recruitment</option>
                                    </select>
                                </div>
                                <div>
                                    <label
                                        htmlFor="event-start-date"
                                        className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5"
                                    >
                                        Start Date
                                    </label>
                                    <input
                                        id="event-start-date"
                                        type="date"
                                        required
                                        value={currentEvent.date || ""}
                                        onChange={(e) =>
                                            setCurrentEvent({ ...currentEvent, date: e.target.value })
                                        }
                                        className="w-full px-4 py-2.5 rounded-lg bg-black border border-gray-800 text-white focus:border-[#ffdc36] focus:ring-1 focus:ring-[#ffdc36] outline-none"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="event-end-date"
                                        className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5"
                                    >
                                        End Date (Optional)
                                    </label>
                                    <input
                                        id="event-end-date"
                                        type="date"
                                        value={currentEvent.endDate || ""}
                                        onChange={(e) =>
                                            setCurrentEvent({
                                                ...currentEvent,
                                                endDate: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2.5 rounded-lg bg-black border border-gray-800 text-white focus:border-[#ffdc36] focus:ring-1 focus:ring-[#ffdc36] outline-none"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="event-time"
                                        className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5"
                                    >
                                        Time
                                    </label>
                                    <input
                                        id="event-time"
                                        type="text"
                                        placeholder="e.g. 09:00 AM"
                                        value={currentEvent.time || ""}
                                        onChange={(e) =>
                                            setCurrentEvent({ ...currentEvent, time: e.target.value })
                                        }
                                        className="w-full px-4 py-2.5 rounded-lg bg-black border border-gray-800 text-white focus:border-[#ffdc36] focus:ring-1 focus:ring-[#ffdc36] outline-none"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="event-location"
                                        className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5"
                                    >
                                        Location
                                    </label>
                                    <input
                                        id="event-location"
                                        type="text"
                                        required
                                        value={currentEvent.location || ""}
                                        onChange={(e) =>
                                            setCurrentEvent({
                                                ...currentEvent,
                                                location: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2.5 rounded-lg bg-black border border-gray-800 text-white focus:border-[#ffdc36] focus:ring-1 focus:ring-[#ffdc36] outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label
                                    htmlFor="event-description"
                                    className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5"
                                >
                                    Description
                                </label>
                                <textarea
                                    id="event-description"
                                    rows={4}
                                    required
                                    placeholder="Enter event description"
                                    value={currentEvent.description || ""}
                                    onChange={(e) =>
                                        setCurrentEvent({
                                            ...currentEvent,
                                            description: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2.5 rounded-lg bg-black border border-gray-800 text-white focus:border-[#ffdc36] focus:ring-1 focus:ring-[#ffdc36] outline-none resize-none"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="featured"
                                    checked={currentEvent.featured || false}
                                    onChange={(e) =>
                                        setCurrentEvent({
                                            ...currentEvent,
                                            featured: e.target.checked,
                                        })
                                    }
                                    className="w-5 h-5 rounded border-gray-800 bg-black text-[#ffdc36] focus:ring-[#ffdc36]"
                                    title="Feature this event on the homepage"
                                    aria-label="Feature this event on the homepage"
                                />
                                <label
                                    htmlFor="featured"
                                    className="text-sm font-medium text-gray-300"
                                >
                                    Feature this event on the homepage
                                </label>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                                <button
                                    type="button"
                                    onClick={() => setIsEventModalOpen(false)}
                                    className="px-6 py-2 rounded-lg font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={savingEvent}
                                    className="px-6 py-2 rounded-lg font-bold bg-[#ffdc36] text-black hover:bg-[#e6c229] transition disabled:opacity-50 flex items-center gap-2"
                                >
                                    {savingEvent && (
                                        <Loader2 className="animate-spin" size={18} />
                                    )}
                                    {savingEvent ? "Saving..." : "Save Event"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isNewsModalOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="news-modal-title"
                >
                    <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex justify-between items-center p-6 border-b border-gray-800 sticky top-0 bg-[#0f0f0f] z-10">
                            <h3
                                id="news-modal-title"
                                className="text-xl font-bold text-white"
                            >
                                {currentNews.id ? "Edit Article" : "Add New Article"}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsNewsModalOpen(false)}
                                className="text-gray-400 hover:text-white transition"
                                aria-label="Close modal"
                            >
                                <X size={24} aria-hidden="true" />
                            </button>
                        </div>
                        <form onSubmit={handleSaveNews} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label
                                        htmlFor="news-title"
                                        className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5"
                                    >
                                        Title
                                    </label>
                                    <input
                                        id="news-title"
                                        type="text"
                                        required
                                        placeholder="Enter article title"
                                        value={currentNews.title || ""}
                                        onChange={(e) =>
                                            setCurrentNews({ ...currentNews, title: e.target.value })
                                        }
                                        className="w-full px-4 py-2.5 rounded-lg bg-black border border-gray-800 text-white focus:border-[#ffdc36] focus:ring-1 focus:ring-[#ffdc36] outline-none"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label
                                            htmlFor="news-author"
                                            className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5"
                                        >
                                            Author
                                        </label>
                                        <input
                                            id="news-author"
                                            type="text"
                                            required
                                            placeholder="Author name"
                                            value={currentNews.author || ""}
                                            onChange={(e) =>
                                                setCurrentNews({
                                                    ...currentNews,
                                                    author: e.target.value,
                                                })
                                            }
                                            className="w-full px-4 py-2.5 rounded-lg bg-black border border-gray-800 text-white focus:border-[#ffdc36] focus:ring-1 focus:ring-[#ffdc36] outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="news-date"
                                            className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5"
                                        >
                                            Published Date
                                        </label>
                                        <input
                                            id="news-date"
                                            type="date"
                                            required
                                            value={
                                                currentNews.published_at
                                                    ? new Date(currentNews.published_at)
                                                        .toISOString()
                                                        .split("T")[0]
                                                    : ""
                                            }
                                            onChange={(e) =>
                                                setCurrentNews({
                                                    ...currentNews,
                                                    published_at: e.target.value,
                                                })
                                            }
                                            className="w-full px-4 py-2.5 rounded-lg bg-black border border-gray-800 text-white focus:border-[#ffdc36] focus:ring-1 focus:ring-[#ffdc36] outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label
                                        htmlFor="news-image"
                                        className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5"
                                    >
                                        Banner Image
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-32 h-20 bg-gray-900 rounded-lg overflow-hidden border border-gray-800 group">
                                            {newsImageFile ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={URL.createObjectURL(newsImageFile)}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : currentNews.image_url ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={currentNews.image_url}
                                                    alt="Current"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-600">
                                                    <Camera size={20} />
                                                </div>
                                            )}
                                        </div>
                                        <input
                                            id="news-image"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                setNewsImageFile(e.target.files?.[0] || null)
                                            }
                                            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#ffdc36] file:text-black hover:file:bg-[#e6c229] transition"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label
                                        htmlFor="news-body"
                                        className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5"
                                    >
                                        Content
                                    </label>
                                    <textarea
                                        id="news-body"
                                        rows={8}
                                        required
                                        placeholder="Article content..."
                                        title="Enter article content"
                                        value={currentNews.body || ""}
                                        onChange={(e) =>
                                            setCurrentNews({ ...currentNews, body: e.target.value })
                                        }
                                        className="w-full px-4 py-2.5 rounded-lg bg-black border border-gray-800 text-white focus:border-[#ffdc36] focus:ring-1 focus:ring-[#ffdc36] outline-none resize-none"
                                        aria-label="Article content"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                                <button
                                    type="button"
                                    onClick={() => setIsNewsModalOpen(false)}
                                    className="px-6 py-2 rounded-lg font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={savingNews}
                                    className="px-6 py-2 rounded-lg font-bold bg-[#ffdc36] text-black hover:bg-[#e6c229] transition disabled:opacity-50 flex items-center gap-2"
                                >
                                    {savingNews && <Loader2 className="animate-spin" size={18} />}
                                    {savingNews ? "Saving..." : "Save Article"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
