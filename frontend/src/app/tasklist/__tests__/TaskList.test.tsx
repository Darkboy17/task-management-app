import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import TaskList from '../page';
import '@testing-library/jest-dom';
import { AnyAction, Dispatch, Middleware } from 'redux';
import { act } from 'react';

// Configure mock store with thunk middleware
const middlewares: Middleware<Record<string, unknown>, unknown, Dispatch<AnyAction>>[] = [
  thunk as Middleware<Record<string, unknown>, unknown, Dispatch<AnyAction>>,
];

const mockStore = configureStore<unknown, AnyAction>(middlewares);

jest.mock("../../store/taskSlice", () => ({
  ...jest.requireActual("../../store/taskSlice"),
  fetchTasks: jest.fn(() => jest.fn().mockResolvedValue([])), // Mock fetchTasks returning an empty array
}));

describe('TaskList Component', () => {
  let store: ReturnType<typeof mockStore>;

  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation((msg) => {
      if (msg.includes("XMLHttpRequest")) return; // Suppress only XHR errors
      console.warn(msg); // Allow other warnings to show
    });
  });

  beforeEach(() => {
    store = mockStore({
      task: {
        tasks: [
          { _id: '1', title: 'Task 1', status: 'pending' },
          { _id: '2', title: 'Task 2', status: 'in-progress' },
        ],
        error: null,
        loading: false,
        totalTasks: 2,
        currentPage: 1,
        limit: 10,
      },
    });

    jest.spyOn(store, "dispatch"); // Spy on dispatch instead of overriding it
  });

  it('renders without crashing', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <TaskList />
        </Provider>
      );
    });
    expect(screen.getByText(/Task Manager/i)).toBeInTheDocument();
  });

  it('displays a list of tasks', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <TaskList />
        </Provider>
      );
    });

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  it('filters tasks by search input', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <TaskList />
        </Provider>
      );
    });

    const searchInput = screen.getByPlaceholderText(/Search by title.../i);
    fireEvent.change(searchInput, { target: { value: 'Task 1' } });

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
  });

  it('filters tasks by status', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <TaskList />
        </Provider>
      );
    });

    const statusSelect = screen.getByRole('combobox');
    fireEvent.change(statusSelect, { target: { value: 'pending' } });

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
  });

  it('shows no tasks message when no tasks match search', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <TaskList />
        </Provider>
      );
    });
  
    const searchInput = screen.getByPlaceholderText(/Search by title.../i);
    
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'Nonexistent Task' } });
    });
  
    expect(await screen.findByText(/No matching tasks found./i)).toBeInTheDocument();
  });
});