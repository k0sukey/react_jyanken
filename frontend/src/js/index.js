import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import fetch from 'isomorphic-fetch'

import 'material-design-lite/material.css'
import 'material-design-lite/material.js'
import '../css/style'


class JyankeGamePage extends Component {
  constructor(props) {
    super(props)
    this.state = {scores: []}
  }
  componentDidMount() {
    this.getScores()
  }
  getScores() {
    fetch('/jyankens.json')
    .then((response) => response.json())
    .then((json) => {
      console.log(json)
      this.setState({scores: json})
    })
    .catch((response) => console.log(response))
  }
  fight(te) {
    const data = JSON.stringify({jyanken: {human: te}})
    fetch('/jyankens.json',
      {method: 'POST',
       headers: {'Content-Type': 'application/json'},
       body: data})
    .then((response) => response.json())
    .then((json) => {
      console.log(json)
      this.getScores()
    })
    .catch((response) => console.log(response))
  }
  render() {
    return (
      <div>
        <Header title="じゃんけん ポン！" />
        <JyankenBox action={this.fight.bind(this)} />
        <ScoreList scores={this.state.scores} />
      </div>
    )
  }
}

const Header = (props) => (<h1>{props.title}</h1>)
Header.propTypes = {
  title: PropTypes.string
}

class JyankenBox extends Component {
  onTeButton(te, event) {
    event.preventDefault()
    this.props.action(te)
  }
  render() {
    const buttonClass = "mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"
    return (
      <div className="jyanken-box">
        <button onClick={this.onTeButton.bind(this, 0)} className={buttonClass}>グー</button>
        <button onClick={this.onTeButton.bind(this, 1)} className={buttonClass}>チョキ</button>
        <button onClick={this.onTeButton.bind(this, 2)} className={buttonClass}>パー</button>
      </div>
    )
  }
}
JyankenBox.propTypes = {
  action: PropTypes.func
}

class ScoreList extends Component {
  render() {
    return (
      <table className="jyanken-table mdl-data-table mdl-js-data-table mdl-shadow--2dp">
        <thead>
          <tr>
            <td>時間</td><td>人間</td><td>コンピュータ</td><td>結果</td>
          </tr>
        </thead>
        {this.props.scores.map((score) => <ScoreListItem  key={score.id} score={score} />)}
       </table>
    )
  }
}
ScoreList.propTypes = {
  scores: PropTypes.array
}

class ScoreListItem extends Component {
  render() {
    const teString = (te) => ["グー","チョキ", "パー"][te]
    const judgmentString = (judgment) => ["引き分け","勝ち", "負け"][judgment]
    const rowColor = (judgment) => [null,"jyanken-win", "jyanken-lose"][judgment]
    const extractHHMM = (t) => t.substr(14, 5)
    return (
      <tbody>
        <tr className={rowColor(this.props.score.judgment)}>
          <td>{extractHHMM(this.props.score.created_at)}</td>
          <td>{teString(this.props.score.human)}</td>
          <td>{teString(this.props.score.computer)}</td>
          <td>{judgmentString(this.props.score.judgment)}</td>
        </tr>
      </tbody>
    )
  }
}
ScoreListItem.propTypes = {
  score: PropTypes.object
}

ReactDOM.render(
  <JyankeGamePage />,
  document.getElementById('example')
)
