import {
  LayoutDashboard,
  Users,
  MessageCircle,
  BarChart2,
} from 'lucide-react';

export const ProductShowcase = () => {
  return (
    <section className="bg-gradient-to-b from-[#FFFFFF] to-[#fcba03] py-32 overflow-x-clip" id='features'>
      <div className="container mx-auto px-4">
        <div className="section-heading text-center">
          <h2 className="section-title mt-5 text-2xl md:text-4xl font-bold">
            A Better Way to Manage and Monitor Your Tasks
          </h2>
          <p className="section-description mt-5 text-gray-700 max-w-2xl mx-auto">
            Organize, assign, and track project progress effortlessly — all within one responsive and collaborative workspace.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <LayoutDashboard className="mx-auto h-8 w-8 text-yellow-500 mb-3" />
            <h3 className="text-lg font-semibold">Workspace & Project Management</h3>
            <p className="text-sm text-gray-600 mt-2">
              Easily organize your projects, workspaces, and team members.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <Users className="mx-auto h-8 w-8 text-yellow-500 mb-3" />
            <h3 className="text-lg font-semibold">Role Management</h3>
            <p className="text-sm text-gray-600 mt-2">
              Assign flexible roles and manage access securely and efficiently.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <MessageCircle className="mx-auto h-8 w-8 text-yellow-500 mb-3" />
            <h3 className="text-lg font-semibold">Chat & Notification</h3>
            <p className="text-sm text-gray-600 mt-2">
              Real-time communication and smart notifications keep everyone in sync.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <BarChart2 className="mx-auto h-8 w-8 text-yellow-500 mb-3" />
            <h3 className="text-lg font-semibold">Project Reporting</h3>
            <p className="text-sm text-gray-600 mt-2">
              Generate clean and insightful progress reports with ease.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};