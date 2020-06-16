function cleanup() {
  return new Promise((resolve, reject) => {
    global.exports.ghmattimysql.execute('DROP TABLE ghm_test_users', () => resolve());
    setTimeout(() => reject(), 20000);
  });
}

export default cleanup;