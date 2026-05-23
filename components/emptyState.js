export function createEmptyState({ title, message }) {
  const wrapper = document.createElement('div');
  wrapper.className = 'empty-state';

  const heading = document.createElement('h3');
  heading.textContent = title;

  const paragraph = document.createElement('p');
  paragraph.textContent = message;

  wrapper.append(heading, paragraph);
  return wrapper;
}
