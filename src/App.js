import _ from 'lodash';
import moment from 'moment';
import ChatView from 'react-chatview';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './styles.less';


export class Message extends Component {
  static propTypes = {
    myself: PropTypes.bool,
    text: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired
  }

  render() {
    var classNames = "message"; // + (this.props.myself ? " sent-message" : " received-message");

    return (
        <div className={classNames}>
          <time>{moment(this.props.time).format('HH:mm')}</time>
          <span>{this.props.text}</span>
        </div>
    );
  }
}

export class ContactListElement extends Component {
  render() {
    var userObj = this.props.userObj;
    return (
        <li className="contact">
          <h5>{userObj.status} - {userObj.name}</h5>
        </li>
    );
  }
}

export class ContactList extends Component {
  render() {
    var contactList = this.props.present;
    var list = contactList.map((userObj, i) => {
      return <ContactListElement userObj={userObj} key={userObj.uid}/>;
    });

    return (
        <div className="contact-list">
          <span><h1>Users Online {contactList.length}</h1></span>
          <ul>{list}</ul>
        </div>
    );
  }
}

var randInt = (i) => {return 1;};

export class Compose extends Component {
  render() {
    return (
        <div className="composition-area">
            <textarea
                onKeyDown={this.onKeyDown}
                onChange={this.onChange}
                value={this.props.cursor.value()} />
        </div>
    );
  }

  onChange = (e) => {
    this.props.cursor.set(e.target.value);
  }

  onKeyDown = (e) => {
    if (e.keyCode == 13) {
      console.log('enter pressed');
      e.preventDefault();
      this.props.sendMessage(this.props.cursor.value());
    }
  }
}

export class MessageDisplay extends Component {
  render() {
    console.log('this.props.messages', this.props.messages);
    var rows = this.props.messages.map((record) => {
        return(
            <Message
                myself={record.uid === this.props.currentUserId}
                text={record.messageText}
                key={record.messageId}
                time={record.time} />
        );
    });

    var sendMessage = _.partial(this.props.sendMessage, _, this.props.currentUserId);

    return (
        <div className="message-display">
          <ChatView className="message-list"
                    flipped={true}
                    scrollLoadThreshold={50}
                    onInfiniteLoad={this.props.loadMoreHistory}>
            {rows}
          </ChatView>
          <Compose sendMessage={sendMessage} cursor={this.props.composeTextCursor}/>
        </div>

    )
  }
}

export default class MessagesApp extends Component {
  render() {
    var controller = this.props.messagesController;

    return (
        <div className="messages-app">
          <MessageDisplay
              isInfiniteLoading={this.props.cursor.refine('isInfiniteLoading').value()}
              sendMessage={controller.sendMessage.bind(controller)}
              currentUserId={this.props.cursor.refine('currentUserId').value()}
              messages={this.props.cursor.refine('messages').value()}
              composeTextCursor={this.props.cursor.refine('composeText')}
              loadMoreHistory={controller.loadMoreHistory.bind(controller)}/>
          <ContactList
              present={this.props.cursor.refine('present').value()}/>
        </div>
    );
  }
}
