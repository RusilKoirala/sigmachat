import React from 'react';
import PropTypes from 'prop-types';
import { formatRelative } from 'date-fns';
import '../message.css'; // Adjust the path according to your folder structure

const formatDate = (date) => {
  let formattedDate = '';
  if (date) {
    // Convert the date in words relative to the current date
    formattedDate = formatRelative(date, new Date());
    // Uppercase the first letter
    formattedDate =
      formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }
  return formattedDate;
};

const Message = ({
  createdAt = null,
  text = '',
  displayName = '',
  photoURL = '',
  isUserMessage = false, // Indicate if the message is from the user
}) => {
  if (!text) return null;

  return (
    <div className="message-container flex items-start">
  {photoURL && (
    <img
      src={photoURL}
      alt="Avatar"
      className="profile-icon"
      width={30}
      height={30}
    />
  )}

  <div className="message-content ml-3 flex flex-col w-full">
    <div className="message-header flex justify-between items-center mb-1">
      <p className="username text-primary-500">{displayName}</p>
      {createdAt?.seconds && (
        <span className="timestamp text-xs text-gray-500">
          {formatDate(new Date(createdAt.seconds * 1000))}
        </span>
      )}
    </div>

    <p className="message-text text-sm">{text}</p>
  </div>
</div>

  );
};

Message.propTypes = {
  text: PropTypes.string,
  createdAt: PropTypes.shape({
    seconds: PropTypes.number,
  }),
  displayName: PropTypes.string,
  photoURL: PropTypes.string,
  isUserMessage: PropTypes.bool, // New prop for identifying user message
};

export default Message;
