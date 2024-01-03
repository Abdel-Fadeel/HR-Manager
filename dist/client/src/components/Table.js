import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import { TableVirtuoso } from "react-virtuoso";
const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
        border: 0,
    },
}));
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));
const VirtuosoTableComponents = {
    Scroller: React.forwardRef((props, ref) => (<TableContainer component={Paper} {...props} ref={ref} sx={{ borderRadius: 0 }}/>)),
    Table: (props) => (<Table {...props} sx={{ borderCollapse: "separate", tableLayout: "fixed" }}/>),
    TableHead,
    TableRow: ({ ...props }) => <StyledTableRow {...props}/>,
    TableBody: React.forwardRef((props, ref) => (<TableBody {...props} ref={ref}/>)),
};
const ReactVirtualizedTable = ({ rows, columns, }) => {
    const TableHeader = () => {
        return (<TableRow>
        {columns.map((column) => (<StyledTableCell key={column.dataKey} variant="head" align={"left"} style={{ width: column.width }} sx={{
                    backgroundColor: "background.paper",
                }}>
            {column.label}
          </StyledTableCell>))}
      </TableRow>);
    };
    const rowContent = (_index, row) => {
        return (<React.Fragment>
        {columns.map((column) => (<TableCell key={column.dataKey} align={"left"}>
            {row[column.dataKey]}
          </TableCell>))}
      </React.Fragment>);
    };
    return (<Paper className="h-full">
      <TableVirtuoso data={rows} components={VirtuosoTableComponents} fixedHeaderContent={TableHeader} itemContent={rowContent}/>
    </Paper>);
};
export default ReactVirtualizedTable;
