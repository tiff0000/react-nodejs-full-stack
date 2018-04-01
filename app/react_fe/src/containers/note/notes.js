import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import * as Actions from '../../store/actions/';
import SubIssue from '../issue/SubIssue';
import EditNote from './EditNote';
import Chatbox from '../../components/box/Chatbox';
import Card from '../../components/box/Card';
import Box from '../../components/box/Box';

class Notes extends Component {

    state = {
      noteIndex : null,
      showSubscribe: null
    }

    componentDidMount() {
      this.props.getIssue(this.props.token, this.props.match.params.id);
    }


    priorityColorHandler = (priority) => {
      switch (priority) {
        case ('urgent'): return 'danger'
        case ('high'): return 'warning'
        case ('medium'): return 'dark'
        default: return 'dark'
      }
    }

    selectSubscribeHandler = () => {
      this.setState({showSubscribe: true});
    }

    unselectSubscribeHandler = () => {
      this.setState({showSubscribe: null});
    }

    selectNoteHandler = (index) => {
      this.setState({noteIndex: index});
    }

    unselectNoteHandler = () => {
      this.setState({noteIndex: null});
    }


    render () {

      let subscribers = (this.props.issue) ? (<Box title='Subscribers' type='no-header'>{this.props.issue.subscribers}</Box>) :
                                              null;

      let subscribe = (this.state.showSubscribe) ? (<Box type="no-header"><SubIssue subscribeShow={this.state.showSubscribe} /></Box>) : null;

      let issue = (this.props.issue) ? (<Card created_by={this.props.issue.created_by}
                                          created_on={new Date(this.props.issue.created_on).toDateString()}
                                          issue_id={this.props.issue._id}
                                          title={this.props.issue.title}
                                          status={this.props.issue.status}
                                          priority={this.props.issue.priority}
                                          description={this.props.issue.description}
                                          btn_clr ={((this.props.issue.status) === 'open') ? 'blue' : 'red'}
                                          header_clr={this.priorityColorHandler(this.props.issue.priority)}
                                          subscribeSelect={() => this.selectSubscribeHandler()}
                                          unsubscribeSelect={() => this.unselectSubscribeHandler()}
                                          showSubscribe={this.state.showSubscribe}
                                          url={this.props.match.url}
                                          type='issue-notes' />) : null;

      let notes = (this.props.issue) ? ((this.props.issue.notes.length < 1) ? null :
         (this.props.issue.notes.map((note, index) => { return (this.state.noteIndex === index) ?
                                                      <EditNote key={note._id}
                                                       note_id={note._id}
                                                       issue_id={this.props.issue._id}
                                                       message={note.message}
                                                       created_on={new Date(note.created_on).toDateString()}
                                                       created_by={note.created_by}
                                                       select={() => this.selectNoteHandler(index)}
                                                       unselect={() => this.unselectNoteHandler()}
                                                       url={this.props.match.url}/> :
                                                      <Chatbox key={note._id}
                                                       note_id={note._id}
                                                       message={note.message}
                                                       created_on={new Date(note.created_on).toDateString()}
                                                       created_by={note.created_by}
                                                       select={() => this.selectNoteHandler(index)}
                                                       url={this.props.match.url}/> }
                                                     ))) : null;

      return (
        <Container>
            <Row>
              <Col md="4">
                {issue}
                {subscribe}
                {subscribers}
              </Col>
              <Col md="8">
                {notes}
              </Col>
              </Row>
        </Container>);
    }
}

const mapStateToProps = state => {
  return {
      token: state.user.token,
      userId: state.user.userId,
      name: state.user.name,
      issue: state.issue.issue,
      error: state.issue.error,
      errorMsg: state.issue.errorMsg
  };
};

// pass using props , this.props.onSetNotes
const mapDispatchToProps = dispatch => {
  return {
    getIssue: (token, id) => dispatch(Actions.getIssue(token, id)),
    subscribeIssue: (token, id) => dispatch(Actions.getIssue(token, id))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Notes);
