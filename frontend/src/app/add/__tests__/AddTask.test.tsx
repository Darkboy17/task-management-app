import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddTask from '../page';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store'; // Use redux-mock-store for testing
import thunk from 'redux-thunk';
import { AnyAction, Dispatch, Middleware } from 'redux';
import { useRouter } from "next/navigation";

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
}

interface RootState {
  tasks: {
    tasks: Task[]; // Replace `any[]` with the actual task type if available
    status: string;
    error: string | null;
  };
}

// Configure the mock store with thunk middleware
const middlewares: Middleware<Record<string, unknown>, unknown, Dispatch<AnyAction>>[] = [
  thunk as Middleware<Record<string, unknown>, unknown, Dispatch<AnyAction>>, // Explicitly cast thunk
];
const mockStore = configureStore<RootState, AnyAction>(middlewares); // Correct usage of redux-mock-store

jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
  }));
  
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(), // Mock push function
      replace: jest.fn(),
      prefetch: jest.fn(),
    });
  });

describe('AddTask Component', () => {
  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    store = mockStore({
      tasks: {
        tasks: [],
        status: 'idle',
        error: null,
      },
    } as RootState);
  });

  it('renders without crashing', () => {
    render(
      <Provider store={store}>
        <AddTask />
      </Provider>
    );
    expect(screen.getByText(/Add New Task/i)).toBeInTheDocument();
  });

  it('allows input for title, description, and status', () => {
    render(
      <Provider store={store}>
        <AddTask />
      </Provider>
    );

    const titleInput = screen.getByPlaceholderText(/Title/i) as HTMLInputElement;
    const descriptionInput = screen.getByPlaceholderText(/Description/i) as HTMLTextAreaElement;
    const statusSelect = screen.getByRole('combobox') as HTMLSelectElement;

    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'Task Description' } });
    fireEvent.change(statusSelect, { target: { value: 'in-progress' } });

    expect(titleInput.value).toBe('New Task');
    expect(descriptionInput.value).toBe('Task Description');
    expect(statusSelect.value).toBe('in-progress');
  });

  it('submits the form and dispatches the addTask action', async () => {
    render(
      <Provider store={store}>
        <AddTask />
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText(/Title/i), { target: { value: 'New Task' } });
    fireEvent.change(screen.getByPlaceholderText(/Description/i), { target: { value: 'Task Description' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'in-progress' } });

    fireEvent.click(screen.getByText(/Add Task/i));

    const actions = store.getActions(); // Now this works
    expect(actions[0].type).toEqual('tasks/add/pending');
  });
});