// AccountDropdown.js
const { default: React } = require('react');

const AccountDropdown = () => {
  return (
    <div className="account-dropdown">
      <button className="account-button">帐户</button>
      <div className="dropdown-content">
        <a href="/profile">个人资料</a>
        <a href="/settings">设置</a>
        <a href="/logout">登出</a>
      </div>
    </div>
  );
};

export default AccountDropdown;
