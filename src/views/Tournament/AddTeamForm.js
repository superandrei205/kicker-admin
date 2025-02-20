import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import SelectPlayersForm from "./SelectPlayersForm";
import CircularProgress from "@material-ui/core/CircularProgress";
import * as api from "../../store/tournamentStats";

const DEFAULT_STATE = {
  isLoading: false,
  isOpenDialog: false,
  isOpenPlayerList1: false,
  isOpenPlayerList2: false,
  selectedPlayer1: "",
  selectedPlayer2: "",
  isDisabledSaveButton: true,
  teamName: "",
  tournament: [],
  disabledPlayer: ""
};

class AddTeamForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = DEFAULT_STATE;
  }

  loadTournamentData = async id => {
    const [tournament] = await Promise.all([api.fetchTournament(id)]);
    this.setState({ tournament });

    if (tournament) {
      const { usersStats } = await api.fetchTournamentStats({
        tournamentId: tournament.id
      });
      this.setState({
        disabledPlayer: usersStats.all
      });
    }
  };

  componentDidMount() {
    this.loadTournamentData(2);
  }

  writeTeamName = event => {
    this.setState({ teamName: event.target.value }, () => {
      this.controlButtonDisabled();
    });
  };

  openOrCloseAddTeamForm = () => {
    this.setState({ isOpenDialog: !this.state.isOpenDialog });
  };

  openOrClosePlayerList1 = () => {
    this.setState({ isOpenPlayerList1: !this.state.isOpenPlayerList1 });
  };

  openOrClosePlayerList2 = () => {
    this.setState({ isOpenPlayerList2: !this.state.isOpenPlayerList2 });
  };

  selectAndClosePlayerList1 = value => {
    this.setState({ selectedPlayer1: value }, () => {
      if (this.compareSelectedPlayers1(value)) {
        this.controlButtonDisabled();
        this.openOrClosePlayerList1();
      }
    });
  };

  selectAndClosePlayerList2 = value => {
    this.setState({ selectedPlayer2: value }, () => {
      if (this.compareSelectedPlayers2(value)) {
        this.controlButtonDisabled();
        this.openOrClosePlayerList2();
      }
    });
  };

  controlButtonDisabled = () => {
    if (
      this.state.teamName &&
      this.state.selectedPlayer1 &&
      this.state.selectedPlayer2
    ) {
      this.setState({ isDisabledSaveButton: false });
    }
  };

  cleanAddTeamForm = () => {
    this.setState(DEFAULT_STATE);
    this.openOrCloseAddTeamForm();
  };

  createNewTeam = () => {
    const team = {
      name: this.state.teamName,
      player1: this.state.selectedPlayer1.id,
      player2: this.state.selectedPlayer2.id,
      tournament: this.state.tournament.id
    };
    console.log(team);
    this.cleanAddTeamForm();
  };

  compareSelectedPlayers1 = value => {
    if (value.id === this.state.selectedPlayer2.id) {
      console.log("Так нельзя");
      return false;
    } else return true;
  };

  compareSelectedPlayers2 = value => {
    if (value.id === this.state.selectedPlayer1.id) {
      console.log("Так нельзя");
      return false;
    } else return true;
  };

  render() {
    const {
      isOpenDialog,
      isOpenPlayerList1,
      isOpenPlayerList2,
      isDisabledSaveButton,
      selectedPlayer1,
      selectedPlayer2,
      teamName
    } = this.state;
    if (this.state.isLoading) {
      return <CircularProgress color={"secondary"} size={20} />;
    }
    return (
      <div style={{ textAlign: "center" }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={this.openOrCloseAddTeamForm}
        >
          ADD NEW TEAM
        </Button>
        <Dialog open={isOpenDialog} onClose={this.openAddTeamForm} fullWidth>
          <DialogTitle>Create new team</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Team name"
              fullWidth
              onChange={this.writeTeamName}
              value={teamName}
            />
          </DialogContent>
          <List>
            <ListItem button onClick={this.openOrClosePlayerList1}>
              <ListItemAvatar>
                <Avatar src={selectedPlayer1.photoUrl}></Avatar>
              </ListItemAvatar>
              <ListItemText primary={selectedPlayer1.name || "Игрок 1"} />
            </ListItem>
            <SelectPlayersForm
              disabledPlayer={this.state.disabledPlayer}
              close={this.openOrClosePlayerList1}
              open={isOpenPlayerList1}
              select={this.selectAndClosePlayerList1}
            />
            <ListItem button onClick={this.openOrClosePlayerList2}>
              <ListItemAvatar>
                <Avatar src={selectedPlayer2.photoUrl}></Avatar>
              </ListItemAvatar>
              <ListItemText primary={selectedPlayer2.name || "Игрок 2"} />
            </ListItem>
            <SelectPlayersForm
              disabledPlayer={this.state.disabledPlayer}
              close={this.openOrClosePlayerList2}
              open={isOpenPlayerList2}
              select={this.selectAndClosePlayerList2}
            />
          </List>
          <DialogActions>
            <Button
              onClick={this.cleanAddTeamForm}
              variant="outlined"
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={this.createNewTeam}
              variant="contained"
              color="primary"
              disabled={isDisabledSaveButton}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default AddTeamForm;
