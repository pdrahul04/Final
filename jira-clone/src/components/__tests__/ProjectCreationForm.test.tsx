import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { store } from '../../store';
import ProjectCreationForm from '../ProjectCreation/ProjectCreationForm';

describe('ProjectCreationForm', () => {
  const onCancelMock = vi.fn();
  const onSuccessMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders inputs and submits correctly', async () => {
    const mockDispatch = vi.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <ProjectCreationForm onCancel={onCancelMock} onSuccess={onSuccessMock} />
      </Provider>
    );

    // Fill in project name
    const nameInput = screen.getByPlaceholderText(/enter project name/i);
    fireEvent.change(nameInput, { target: { value: 'My New Project' } });

    // Fill in project description
    const descriptionInput = screen.getByPlaceholderText(/describe your project/i);
    fireEvent.change(descriptionInput, { target: { value: 'This is a test project' } });

    // Select Scrum project type
    const scrumOption = screen.getByText(/Scrum/i);
    fireEvent.click(scrumOption);

    // Click submit
    const submitBtn = screen.getByRole('button', { name: /create project/i });
    fireEvent.click(submitBtn);

    // Wait for mock dispatch and onSuccess
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      expect(onSuccessMock).toHaveBeenCalled();
    });
  });

  it('shows validation errors if required fields are missing', async () => {
    render(
      <Provider store={store}>
        <ProjectCreationForm onCancel={onCancelMock} onSuccess={onSuccessMock} />
      </Provider>
    );

    const submitBtn = screen.getByRole('button', { name: /create project/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/project name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/project description is required/i)).toBeInTheDocument();
    expect(onSuccessMock).not.toHaveBeenCalled();
  });

  it('calls onCancel when Cancel button is clicked', () => {
    render(
      <Provider store={store}>
        <ProjectCreationForm onCancel={onCancelMock} onSuccess={onSuccessMock} />
      </Provider>
    );

    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelBtn);

    expect(onCancelMock).toHaveBeenCalled();
  });
});
