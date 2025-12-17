"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

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
      // Handle empty/204 responses safely
      const hasBody = (res.headers.get("content-length") ?? "0") !== "0";
      const data: CommitteeMember[] = hasBody ? await res.json() : [];
      setCommittee(data); // autofills UI with existing members
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

  const tabs: { id: TabType; label: string }[] = [
    { id: "committee", label: "Committee" },
    { id: "users", label: "Users" },
    { id: "news", label: "News" },
    { id: "events", label: "Events" },
    { id: "merch", label: "Merch" },
  ];

  if (loading)
    return <p className="text-white text-center pt-24">Loading...</p>;

  return (
    <div className="min-h-screen bg-black text-white pt-30 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#ffdc36]">Admin Dashboard</h1>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition"
          >
            Logout
          </button>
        </div>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <div className="flex gap-2 mb-6 border-b border-[#ffdc36]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-semibold transition ${
                activeTab === tab.id
                  ? "text-[#ffdc36] border-b-2 border-[#ffdc36]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-[#0f0f0f] border border-[#ffdc36] rounded-lg p-6">
          {activeTab === "committee" && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Committee</h2>
              {committee.length === 0 ? (
                <p className="text-gray-400">No committee data found</p>
              ) : (
                <div className="space-y-6">
                  {committee.map((member) => (
                    <div
                      key={member.id}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start border border-gray-700 p-4 rounded"
                    >
                      <div className="md:col-span-2 space-y-4">
                        <div>
                          <label className="block text-sm mb-1">Role</label>
                          <input
                            id={`member-role-${member.id}`}
                            type="text"
                            value={member.role}
                            readOnly
                            aria-readonly="true"
                            title={`Role: ${member.role}`}
                            placeholder={member.role}
                            aria-label={`Role: ${member.role}`}
                            className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-gray-300"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor={`member-name-${member.id}`}
                            className="block text-sm mb-1"
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
                            placeholder="Enter committee member name"
                            className="w-full px-4 py-2 rounded-md bg-gray-900 border border-gray-700 text-white focus:border-[#ffdc36] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor={`member-bio-${member.id}`}
                            className="block text-sm mb-1"
                          >
                            Bio
                          </label>
                          <textarea
                            id={`member-bio-${member.id}`}
                            value={member.bio}
                            onChange={(e) =>
                              updateMember(member.id, { bio: e.target.value })
                            }
                            placeholder="Enter committee member bio"
                            rows={3}
                            className="w-full px-4 py-2 rounded-md bg-gray-900 border border-gray-700 text-white focus:border-[#ffdc36] focus:outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Photo</label>
                        <div className="flex items-center gap-3">
                          {member.photoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={member.photoUrl}
                              alt={`${member.role} - ${member.name}`}
                              className="w-16 h-16 object-cover rounded"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-800 rounded" />
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            title={`Upload photo for ${member.role} - ${member.name}`}
                            aria-label={`Upload photo for ${member.role} - ${member.name}`}
                            onChange={(e) =>
                              handlePhotoSelect(
                                member.id,
                                e.target.files?.[0] ?? null
                              )
                            }
                            className="text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-end">
                    <button
                      onClick={saveCommittee}
                      disabled={savingCommittee}
                      className="bg-[#ffdc36] text-black font-semibold px-4 py-2 rounded-md hover:bg-yellow-400 transition disabled:opacity-50"
                    >
                      {savingCommittee ? "Saving…" : "Save Changes"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "users" && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Users</h2>
              {users.length === 0 ? (
                <p className="text-gray-400">No users found</p>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#ffdc36]">
                      <th className="text-left py-2">Email</th>
                      <th className="text-left py-2">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-gray-700 hover:bg-gray-900"
                      >
                        <td className="py-3">{user.email}</td>
                        <td className="py-3">{user.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
