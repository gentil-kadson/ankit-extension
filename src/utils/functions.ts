export const waitThenRemoveMessage = (func: any) => {
  setTimeout(() => {
    func();
  }, 5000);
};
