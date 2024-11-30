import { logout } from "@/services/api";


export default function LogoutButton() {
  return (
    <button onClick={logout} className="bg-red-500 text-white px-4 py-1 rounded">
      Logout
    </button>
  );
}