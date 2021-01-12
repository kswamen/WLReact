import React from "react";
import PropTypes from "prop-types";
import { withStyles, useTheme } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Moment from "react-moment";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import { LoginContext } from "./LoginContext";

import "../css/postTablePage.css";

const styles = (theme) => ({
  table: {
    minWidth: 700,
  },
});

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "rgba(0,0,0,1)",
    color: theme.palette.common.white,
    fontSize: 20,
    position: "sticky",
  },
  body: {
    fontSize: 25,
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
    "&:hover": {
      backgroundColor: "rgba(100, 0, 0, 0.3) !important",
    },
  },
}))(TableRow);

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div style={{ display: "flex" }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0}>
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        <LastPageIcon />
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

class BulletinBoardMain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      page: 0,
      rowsPerPage: 5,
    };
  }

  componentDidMount() {
    this.callApi()
      .then((res) => {
        this.setState({
          posts: res,
        });
      })
      .catch((err) => console.log(err));
  }

  callApi = async () => {
    const response = await fetch("/api/customers");
    const body = await response.json();
    return body;
  };

  render() {
    const emptyRows =
      this.state.rowsPerPage -
      Math.min(
        this.state.rowsPerPage,
        this.state.posts.length - this.state.page * this.state.rowsPerPage
      );

    const handleChangePage = (event, newPage) => {
      this.setState({
        page: newPage,
      });
    };

    const handleChangeRowsPerPage = (event) => {
      this.setState({
        rowsPerPage: parseInt(event.target.value, 10),
        page: 0,
      });
    };

    const { classes } = this.props;
    return (
      <>
        <Paper
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            top: this.props.AppbarHeight + 15,
            height: "auto",
            position: "relative",
            width: "90vw",
            left: "5vw",
            borderRadius: "15px",
            border: 30,
            borderColor: "#ffffff",
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            maxHeight: "85vh",
          }}
        >
          <TableContainer
            style={{
              maxHeight: "80vh",
            }}
          >
            <Table
              stickyHeader
              className={classes.table}
              aria-label="customized table"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">No.</StyledTableCell>
                  <StyledTableCell align="center">Image</StyledTableCell>
                  <StyledTableCell align="center">Title</StyledTableCell>
                  <StyledTableCell align="right">Writer</StyledTableCell>
                  <StyledTableCell align="right">Date</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(this.state.rowsPerPage > 0
                  ? this.state.posts.slice(
                    this.state.page * this.state.rowsPerPage,
                    this.state.page * this.state.rowsPerPage +
                    this.state.rowsPerPage
                  )
                  : this.state.posts
                ).map((row) => (
                  <StyledTableRow
                    key={row.num}
                    hover
                    component={Link}
                    to={"/postPage/" + row.num}
                  >
                    <StyledTableCell align="center" component="th" scope="row">
                      {row.num}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <img
                        style={{
                          borderRadius: "50%",
                          maxHeight: "15vh",
                        }}
                        src={row.image}
                      />
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.title}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {row.writer}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{ width: "15%", fontSize: 15 }}
                      align="right"
                    >
                      <Moment
                        style={{ whiteSpace: "pre" }}
                        format="YYYY-MMM-D HH:MM"
                        withTitle
                      >
                        {row.date}
                      </Moment>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div style={{ display: "flex" }}>
            <LoginContext.Consumer>
              {({ isLoggedIn }) => (
                <>
                  {!isLoggedIn ? (
                    ""
                  ) : (
                      <Button
                        href="/createPostPage"
                        style={{
                          backgroundColor: "rgba(100,0,100,0.6)",
                          position: "relative",
                          width: "10vw",
                          marginRight: "20px",
                        }}
                      >
                        <h3 style={{ margin: "5px" }}>신규 게시글 작성</h3>
                      </Button>
                    )}
                </>
              )}
            </LoginContext.Consumer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              colSpan={3}
              count={this.state.posts.length}
              rowsPerPage={this.state.rowsPerPage}
              page={this.state.page}
              component="div"
              labelRowsPerPage="페이지 당 게시물 수"
              style={{
                backgroundColor: "rgba(255, 215, 0, 0.6)",
                borderRadius: "7px",
              }}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </div>
        </Paper>
      </>
    );
  }
}

export default withStyles(styles)(BulletinBoardMain);
