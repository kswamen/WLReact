import React from "react";
import Paper from '@material-ui/core/Paper';
import {
    ArgumentAxis,
    ValueAxis,
    Chart,
    LineSeries,
} from '@devexpress/dx-react-chart-material-ui';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Divider from '@material-ui/core/Divider';
import Typography from "@material-ui/core/Typography";


const styles = (theme) => ({
    table: {
        minWidth: 700,
    },
    divider: {
        margin: theme.spacing(1),
        color: 'rgba(0,0,0,0)',
    }
});

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: "rgba(0,0,0,1)",
        color: theme.palette.common.white,
        fontSize: 20,
        position: "sticky",
    },
    body: {
        fontSize: 18,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        "&:nth-of-type(odd)": {
            backgroundColor: "rgba(255, 255, 255, 0.6)",
        },
        "&:nth-of-type(even)": {
            backgroundColor: "rgba(152, 152, 152, 0.6)",
        },
    },
}))(TableRow);


class PatientsTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            patientsData: [
                { argument: '01.06', value: 838 },
                { argument: '01.07', value: 868 },
                { argument: '01.11', value: 451 },
            ]
        }
    }


    render() {
        const { classes } = this.props;
        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <TableContainer
                    style={{
                        marginTop: "10px",
                        marginBottom: "20px",
                        borderRadius: "15px"
                    }}
                >
                    <Table
                        stickyHeader
                        className={classes.table}
                        aria-label="customized table"
                    >
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center"></StyledTableCell>
                                <StyledTableCell align="center">확진환자</StyledTableCell>
                                <StyledTableCell align="center">격리해제</StyledTableCell>
                                <StyledTableCell align="center">격리중</StyledTableCell>
                                <StyledTableCell align="center">사망</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <StyledTableRow>
                                <StyledTableCell style={{ fontSize: '20px', color: 'rgba(47,47,79,1)' }}
                                    align="center" component="th" scope="row">
                                    {'누적'}
                                </StyledTableCell>
                                <StyledTableCell style={{ fontSize: '30px' }} align="center" component="th" scope="row">
                                    {'124124'}
                                </StyledTableCell>
                                <StyledTableCell align="center" component="th" scope="row">
                                    {'124124'}
                                </StyledTableCell>
                                <StyledTableCell align="center" component="th" scope="row">
                                    {'124124'}
                                </StyledTableCell>
                                <StyledTableCell align="center" component="th" scope="row">
                                    {'124124'}
                                </StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell style={{ fontSize: '20px', color: 'rgba(47,47,79,1)' }} rowSpan={2}
                                    align="center" component="th" scope="row">
                                    {'전일 대비'}
                                </StyledTableCell>
                                <StyledTableCell style={{ display: 'flex', justifyContent: 'space-around' }}
                                    align="center" component="th" scope="row">
                                    {'소계'}
                                    <Divider orientation='vertical' flexItem />
                                    {'국내발생'}
                                    <Divider orientation='vertical' flexItem />
                                    {'해외유입'}
                                </StyledTableCell>
                                <StyledTableCell rowSpan={2} align="center" component="th" scope="row">
                                    {'124124'}
                                </StyledTableCell>
                                <StyledTableCell rowSpan={2} align="center" component="th" scope="row">
                                    {'124124'}
                                </StyledTableCell>
                                <StyledTableCell rowSpan={2} align="center" component="th" scope="row">
                                    {'124124'}
                                </StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell style={{ color: 'red', display: 'flex', justifyContent: 'space-around' }}
                                    align="center" component="th" scope="row">
                                    {'13'}
                                    <Divider orientation='vertical' flexItem />
                                    {'13'}
                                    <Divider orientation='vertical' flexItem />
                                    {'13'}
                                </StyledTableCell>
                            </StyledTableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <Paper style={{ backgroundColor: 'rgba(255,255,255,0.8)' }}>
                    <Chart
                        style={{ width: '80vw' }}
                        height={300}
                        data={this.state.patientsData}
                    >
                        <ArgumentAxis />
                        <ValueAxis />

                        <LineSeries valueField="value" argumentField="argument" />
                    </Chart>
                </Paper>
            </div >
        );
    }
}

export default withStyles(styles)(PatientsTable);
