import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";
import { ColumnData } from "../../components/Table";

export const downloadActivityLogPDF = (
  title: string,
  columns: any[],
  data: any
) => {
  const doc = new jsPDF();
  doc.text(title, 15, 10);
  autoTable(doc, {
    columns: columns.map((col) => ({
      dataKey: col.dataKey,
      header: col.label,
    })),
    body: data,
    foot: [
      [
        dayjs(new Date().toString()).format("dddd"),
        dayjs(new Date().toString()).format("DD/MM/YYYY"),
        `Total: ${data.length}`,
      ],
    ],
    showFoot: "lastPage",
  });
  doc.save(`${title}.pdf`);
};

export const activityLogColumns: ColumnData[] = [
  {
    width: 200,
    label: "User Name",
    dataKey: "userName",
  },
  {
    width: 200,
    label: "Activity",
    dataKey: "activity",
  },
  {
    width: 200,
    label: "Time Stamp",
    dataKey: "timeStamp",
  },
];