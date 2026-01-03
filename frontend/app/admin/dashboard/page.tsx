"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, UserCog, Users, Newspaper, Calendar, ShoppingBag, Loader2, Save, Camera } from "lucide-react";

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

type TabType = "committee" | "users" | "news" | "events" | "merch";

export default function AdminDashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("committee");

  const [users, setUsers] = useState<User[]>([]);
  const [committee, setCommittee] = useState<CommitteeMember[]>([]);
  const [savingCommittee, setSavingCommittee] = useState(false);
  const photoFilesRef = useRef<Map<string, File>>(new Map()); // key by member.id

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/admin");
      return;
    }
    // Autofill from backend
    Promise.all([fetchUsers(storedToken), fetchCommittee(storedToken)]).finally(
      () => setLoading(false)
    );
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
    } catch (err) {
      setError((err as Error).message || "Failed to save committee");
    } finally {
      setSavingCommittee(false);
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
    <div className="min-h-screen bg-black text-white pt-24 px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#ffdc36]">Admin Dashboard</h1>
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition shadow-sm"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-[#ffdc36] text-black shadow-md transform scale-105"
                  : "bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-[#2a2a2a]"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-[#0f0f0f] border border-[#ffdc36] rounded-lg p-6">
          {activeTab === "committee" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Manage Committee</h2>
                {committee.length > 0 && (
                  <button
                    onClick={saveCommittee}
                    disabled={savingCommittee}
                    className="flex items-center gap-2 bg-[#ffdc36] text-black font-bold px-4 py-2 rounded-lg hover:bg-[#e6c229] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-900/20"
                  >
                    {savingCommittee ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <Save size={18} />
                    )}
                    <span>{savingCommittee ? "Saving..." : "Save Changes"}</span>
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
                        <label className="block w-full h-full cursor-pointer group bg-gray-900">
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
                              <span className="text-xs font-medium uppercase">Upload</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 border-4 border-dashed border-[#ffdc36] rounded-r-xl">
                            <Camera className="text-[#ffdc36] mb-1" size={24} />
                            <span className="text-[10px] text-white font-bold uppercase tracking-wider">Change Photo</span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handlePhotoSelect(
                                member.id,
                                e.target.files?.[0] ?? null
                              )
                            }
                          />
                        </label>
                      </div>

                      <div className="flex-grow p-6 space-y-4 md:border-r border-gray-800">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Role</label>
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
                        <td className="px-6 py-4 text-gray-300">{user.email}</td>
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
              <h2 className="text-2xl font-semibold mb-4">News</h2>
              <p className="text-gray-400">News management coming soon...</p>
            </div>
          )}

          {activeTab === "events" && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Events</h2>
              <p className="text-gray-400">Events management coming soon...</p>
            </div>
          )}

          {activeTab === "merch" && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Merch</h2>
              <p className="text-gray-400">
                Merchandise management coming soon...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
