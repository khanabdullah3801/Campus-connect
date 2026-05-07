"use client";

import { useState } from "react";
import { updateUserRole, assignGroupRole } from "@/app/actions/adminActions";
import { format } from "date-fns";


export function AdminUserList({ initialUsers, groups }: any) {

  const [users, setUsers] = useState(initialUsers);
  const [loading, setLoading] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((u: any) => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleRoleChange = async (userId: string, newRole: string) => {
    setLoading(userId);
    try {
      await updateUserRole(userId, newRole);
      setUsers(users.map((u: any) => u.id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      alert("Failed to update role");
    } finally {
      setLoading(null);
    }
  };

  const handleGroupAssign = async (userId: string, groupId: string, role: string) => {
    if (!groupId) return;
    setLoading(`${userId}-${groupId}`);
    try {
      await assignGroupRole(groupId, userId, role);
      alert(`Success! User is now a ${role} in this group.`);
    } catch (error) {
      alert("Failed to assign group role");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder:text-gray-400"
        />
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-gray-50 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Student</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Role</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Faculty/Society Admin</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Join Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 bg-white">
            {filteredUsers.map((user: any) => (
              <tr key={user.id} className="group hover:bg-green-50/30 transition-colors">
                <td className="px-6 py-5">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 font-black text-sm mr-4 group-hover:scale-110 transition-transform">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-400 font-medium">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <select 
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    disabled={loading === user.id}
                    className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 focus:ring-2 focus:ring-green-500 transition-all outline-none"
                  >
                    <option value="STUDENT">Student</option>
                    <option value="ALUMNI">Alumni</option>
                    <option value="FACULTY">Faculty (Teacher)</option>
                    <option value="SOCIETY_HEAD">Society Head</option>
                    <option value="ADMIN">Super Admin</option>
                  </select>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center space-x-2">
                    <select 
                      onChange={(e) => handleGroupAssign(user.id, e.target.value, "TEACHER")}
                      disabled={loading?.startsWith(user.id)}
                      className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-[10px] font-black text-green-600 uppercase tracking-wider focus:ring-2 focus:ring-green-500 transition-all outline-none"
                    >
                      <option value="">Promote in Hub...</option>
                      {groups.map((group: any) => (
                        <option key={group.id} value={group.id}>{group.name}</option>
                      ))}
                    </select>
                    <select 
                      onChange={(e) => handleGroupAssign(user.id, e.target.value, "ADMIN")}
                      disabled={loading?.startsWith(user.id)}
                      className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-[10px] font-black text-purple-600 uppercase tracking-wider focus:ring-2 focus:ring-purple-500 transition-all outline-none"
                    >
                      <option value="">Make Hub Admin...</option>
                      {groups.map((group: any) => (
                        <option key={group.id} value={group.id}>{group.name}</option>
                      ))}
                    </select>

                    <select 
                      onChange={(e) => handleGroupAssign(user.id, e.target.value, "MEMBER")}
                      disabled={loading?.startsWith(user.id)}
                      className="bg-red-50 border border-red-100 rounded-xl px-3 py-2 text-[10px] font-black text-red-600 uppercase tracking-wider focus:ring-2 focus:ring-red-500 transition-all outline-none"
                    >
                      <option value="">Demote/Remove Role...</option>
                      {groups.map((group: any) => (
                        <option key={group.id} value={group.id}>{group.name}</option>
                      ))}
                    </select>
                  </div>
                </td>

                <td className="px-6 py-5 text-right">
                  <span className="text-[10px] font-bold text-gray-400">
                    {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                  </span>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredUsers.length === 0 && (
        <div className="p-20 text-center bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
          <p className="text-gray-400 font-bold">No users found matching "{search}"</p>
        </div>
      )}
    </div>
  );
}
