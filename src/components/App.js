import React from 'react';
import api from './test/stubApi.js'
import buttons from './config/buttonsConfig.js';
import ReactDOM from 'react-dom';
import request from 'superagent';
import { run } from "react-server-cli" 

run({
  command: "start",
  routes: "./routes.json",
  port: 3000,
  jsPort: 3001,
  hot: true,
  minify: false,
  jsUrl: null,
  longTermCaching: true,
});

var Stopwatch = React.createClass({
  getInitialState: function() {
    return {
      running: false,
      elapsedTime: 0,
      previousTime: 0,
    }
  },
  
  componentDidMount: function() {
    this.interval = setInterval(this.onTick, 100);
  },
  
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },
  
  onTick: function() {
    if (this.state.running) {
      var now = Date.now();
      this.setState({
        previousTime: now,
        elapsedTime: this.state.elapsedTime + (now - this.state.previousTime),
      });
    }
    console.log('onTick');
  },
  
  onStart: function() {
    this.setState({ 
      running: true,
      previousTime: Date.now(),
    });
  },
  
  onStop: function() {
    this.setState({ running: false });
  },
  
  onReset: function() {
    this.setState({
      elapsedTime: 0,
      previousTime: Date.now(),
    });
  },
  
  render: function() {
    var seconds = Math.floor(this.state.elapsedTime / 1000);
    return (
      <div className="stopwatch">
        <h2>Stopwatch</h2>
        <div className="stopwatch-time">{seconds}</div>
        { this.state.running ? 
          <button onClick={this.onStop}>Stop</button> 
          : 
          <button onClick={this.onStart}>Start</button>
        } 
        <button onClick={this.onReset}>Reset</button>
      </div>
    );
  }
});
  
class TeacherForm extends React.Component {
  state = { name: '', score: '' };

  handleNameChange = (e) => this.setState({ name: e.target.value });

  handleScoreChange = (e) => this.setState({ score: e.target.value });

  handleSubmit = (e) => {
    e.preventDefault();
    let name = this.state.name.trim();
    let score = this.state.score.trim();
    if (!name || !score) {
      return;
    }
    this.props.addHandler(name, score);
    this.setState({ name: '', score: '' });
  }

  render() {
    return (
      <tr>
        <td>
          <input type="text" className="form-control"
            placeholder="Name"
            value={this.state.name}
            onChange={this.handleNameChange}
          />
        </td>

        <td>
          <input type="text" className="form-control"
            placeholder="Score"
            value={this.state.score}
            onChange={this.handleScoreChange}
          />
        </td>
        <td>
          <input type="button" className="btn btn-primary" value="Add"
            onClick={this.handleSubmit} />
        </td>
      </tr>
    )
  }
}

function Header(props) {
  return (
    <div className="header">
      <Teacher teachers={props.teachers}/>
      <h1>{props.title}</h1>
      <Stopwatch />
    </div>
  );
}

Header.propTypes = {
  title: React.PropTypes.string.isRequired,
  teachers: React.PropTypes.array.isRequired,
};

function Counter(props) {
  return (
    <div className="counter">
      <button className="counter-action decrement" onClick={function() {props.onChange(-1);}} > - </button>
      <div className="counter-score"> {props.score} </div>
      <button className="counter-action increment" onClick={function() {props.onChange(1);}}> + </button>
    </div>
  );
}
  
Counter.propTypes = {
  score: React.PropTypes.number.isRequired,
  onChange: React.PropTypes.func.isRequired,
}

class Teacher extends React.Component {
  state = {
    status: '',
    name: this.props.teacher.name,
    score: this.props.teacher.score
  };

  handleEdit = () => this.setState({ status: 'edit' });

  handleSave = (e) => {
    e.preventDefault();
    var name = this.state.name.trim();
    var score = this.state.score.trim();
    if (!name || !score) {
      return;
    }
    this.setState({ status: '' })
    this.props.updateHandler(this.props.Teacher.id,
      name, score);
  };
  handleCancel = function () {
    this.setState({
      status: '',
      name: this.props.teacher.name,
      score: this.props.teacher.score
    });
  }.bind(this)

  handleDelete = () => {
    this.setState({ status: 'del' })
  };

  handleConfirm = (e) => {
    this.props.deleteHandler(this.props.Teacher.id);
  };

  handleNameChange = (e) => this.setState({ name: e.target.value });

  handleScoreChange = (e) => this.setState({ score: e.target.value });

  render() {
    let activeButtons = buttons.normal;
    let leftButtonHandler = this.handleEdit;
    let rightButtonHandler = this.handleDelete;
    let fields = [
      <td key={'name'} >{this.state.name}</td>,
      <td key={'score'}>{this.state.score}</td>
    ];
    if (this.state.status === 'del') {
      activeButtons = buttons.delete;
      leftButtonHandler = this.handleCancel;
      rightButtonHandler = this.handleConfirm;
    } else if (this.state.status === 'edit') {
      activeButtons = buttons.edit;
      leftButtonHandler = this.handleSave;
      rightButtonHandler = this.handleCancel;
      fields = [
        <td key={'name'}><input type="text" className="form-control"
          value={this.state.name}
          onChange={this.handleNameChange} /> </td>,
        <td key={'score'}><input type="text" className="form-control"
          value={this.state.score}
          onChange={this.handleScoreChange} /> </td>,
      ];
    }
    return (
      <tr >
        {fields}
        <td>
          <input type="button" className={'btn ' + activeButtons.leftButtonColor}
            value={activeButtons.leftButtonVal}
            onClick={leftButtonHandler} />
        </td>
        <td>
          <input type="button" className={'btn ' + activeButtons.rightButtonColor}
            value={activeButtons.rightButtonVal}
            onClick={rightButtonHandler} />
        </td>
      </tr>
    );
  }
}
class TeacherList extends React.Component {
    render() {
      let TeacherRows = this.props.teachers.map((c) => {
        return <Teacher key={c.id} teacher={c}
          deleteHandler={this.props.deleteHandler}
          updateHandler={this.props.updateHandler} />;  
      });
      return (
        <tbody >
          {TeacherRows}
          <TeacherForm
            addHandler={this.props.addHandler} />
        </tbody>
      );
    }
  }

class teachersTable extends React.Component {
    render() {
      return (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Score</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <TeacherList teachers={this.props.teachers}
            deleteHandler={this.props.deleteHandler}
            addHandler={this.props.addHandler}
            updateHandler={this.props.updateHandler} />
        </table>
      );
    }
  }

class TeachersApp extends React.Component {
    updateTeacher=
    (key, n, s) => {
    api.update(key, n, s);
    this.setState({});
  };
addTeacher = (n, s) => {
  api.add(n, s);
  this.setState({});
};
deleteTeacher = (k) => {
  api.delete(k);
  this.setState({});
};

render() {
  let teachers = api.getAll();
  return (
    <div>
      <h1>Teacher List.</h1>
      <TeachersTable teachers={teachers}
        deleteHandler={this.deleteTeacher}
        addHandler={this.addTeacher}
        updateHandler={this.updateTeacher} />
    </div>
  );
}
}    

export default TeachersApp;