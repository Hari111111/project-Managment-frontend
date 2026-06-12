import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, X, Search } from "lucide-react";

function MultiUserSelect({ users, selectedUsers, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleUser = (userId) => {
    const isSelected = selectedUsers.includes(userId);
    let newSelected;
    if (isSelected) {
      newSelected = selectedUsers.filter((id) => id !== userId);
    } else {
      newSelected = [...selectedUsers, userId];
    }
    onChange(newSelected);
  };

  const removeUser = (userId, e) => {
    e.stopPropagation();
    onChange(selectedUsers.filter((id) => id !== userId));
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedUserObjects = users.filter((u) => selectedUsers.includes(u._id));

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="input min-h-[46px] flex flex-wrap items-center gap-1.5 pr-10 cursor-pointer select-none"
      >
        {selectedUserObjects.length === 0 ? (
          <span className="text-slate-400 dark:text-slate-600">Select users...</span>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {selectedUserObjects.map((user) => (
              <span
                key={user._id}
                className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700 dark:bg-brand-500/10 dark:text-brand-300"
              >
                {user.name}
                <button
                  type="button"
                  onClick={(e) => removeUser(user._id, e)}
                  className="rounded hover:bg-brand-100 dark:hover:bg-brand-900/50 p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          {/* Search bar */}
          <div className="relative mb-2">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-xs outline-none focus:border-brand-500 dark:border-slate-800 dark:bg-slate-950"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* User List */}
          <div className="max-h-48 overflow-y-auto space-y-1">
            {filteredUsers.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No users found</p>
            ) : (
              filteredUsers.map((user) => {
                const isSelected = selectedUsers.includes(user._id);
                return (
                  <div
                    key={user._id}
                    onClick={() => toggleUser(user._id)}
                    className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-brand-50/50 text-brand-700 dark:bg-brand-500/5 dark:text-brand-300"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold">{user.name}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">{user.role}</span>
                    </div>
                    {isSelected && <Check className="h-4 w-4 text-brand-500" />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MultiUserSelect;
