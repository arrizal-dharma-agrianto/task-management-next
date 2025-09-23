import React from "react";

interface PrintableProjectProps {
  data: any;
  user: any;
}

export const PrintableProject = React.forwardRef<HTMLDivElement, PrintableProjectProps>(
  ({ data, user }, ref) => (
    <div ref={ref} style={{ padding: "20px", fontFamily: "Arial", color: "#333" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
        <img
          width={50}
          height={50}
          src="/assets/images/crackin.jpeg"
          alt="Crackin'Code Logo"
          style={{ width: "50px", height: "50px", marginRight: "10px" }}
        />
        <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>Crackin&apos;Code Task Management</h1>
      </div>

      <hr></hr>

      {/* Project Info */}
      <div className="flex justify-between mt-3">
        <p><strong>Project:</strong> {data.name}</p>
        <p><strong>Workspace:</strong> {data.workspace.name}</p>
      </div>

      {/* Task Section */}
      <h2 style={{ fontSize: "16px", fontWeight: "bold", marginTop: "30px", marginBottom: "12px", textAlign: "center" }}>Project Report</h2>

      {data.taskStatuses.map((status: any) => (
        <div key={status.id} className="mb-8">
          <h3 className="mb-4 text-lg font-semibold">{status.name}</h3>

          {status.tasks.length === 0 ? (
            <p style={{ fontStyle: "italic", color: "#666" }}>No tasks available.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr>
                  <th
                    className={`bg-${status.color}-200`}
                    style={{ ...thStyle, width: "30%" }}
                  >
                    Task Name
                  </th>
                  <th
                    className={`bg-${status.color}-200`}
                    style={{ ...thStyle, width: "20%" }}
                  >
                    Assignees
                  </th>
                  <th
                    className={`bg-${status.color}-200`}
                    style={{ ...thStyle, width: "15%" }}
                  >
                    Priority
                  </th>
                  <th
                    className={`bg-${status.color}-200`}
                    style={{ ...thStyle, width: "20%" }}
                  >
                    Due Date
                  </th>
                  <th
                    className={`bg-${status.color}-200`}
                    style={{ ...thStyle, width: "15%" }}
                  >
                    Attachment
                  </th>
                </tr>
              </thead>
              <tbody>
                {status.tasks.map((task: any) => (
                  <tr key={task.id}>
                    <td style={tdStyle}>{task.title}</td>
                    <td style={tdStyle}>
                      {task.assignees.length > 0
                        ? task.assignees.map((a: any) => a.fullName).join(", ")
                        : "Unassigned"}
                    </td>
                    <td style={tdStyle}>
                      {task.priority ? task.priority.name.charAt(0).toUpperCase() + task.priority.name.slice(1) : "—"}
                    </td>
                    <td style={tdStyle}>
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString("en-GB")
                        : "—"}
                    </td>
                    <td style={tdStyle}>
                      {task.attachments && task.attachments.length > 0
                        ? (
                          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                            {task.attachments.map((file: any, idx: number) => (
                              <li key={file.id || idx}>{idx + 1}.{file.fileName}</li>
                            ))}
                          </ul>
                        )
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
      <div style={{ float: "right", marginTop: "16px" }}>
        <p>
          <strong>Printed at:</strong>{" "}
          {(() => {
            const date = new Date();
            const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
            const day = date.toLocaleDateString("en-US", { day: "2-digit" });
            const month = date.toLocaleDateString("en-US", { month: "long" });
            const year = date.toLocaleDateString("en-US", { year: "numeric" });
            return `${weekday}, ${day} ${month} ${year}`;
          })()}
        </p>
        <p>
          <strong>Printed by:</strong>{" "}
          {user.name || "Unknown User"}
        </p>
      </div>

    </div>
  )
);

// Reusable styles for table
const thStyle: React.CSSProperties = {
  borderBottom: "1px solid #ccc",
  textAlign: "left",
  padding: "8px",
  // backgroundColor: "#f5f5f5",
};

const tdStyle: React.CSSProperties = {
  borderBottom: "1px solid #eee",
  padding: "8px",
};

PrintableProject.displayName = "PrintableProject";
