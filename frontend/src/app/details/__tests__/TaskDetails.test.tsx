import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import TaskDetails from '../[id]/page';
import '@testing-library/jest-dom';
import { AnyAction, Dispatch, Middleware } from 'redux';
import { act } from 'react';
import { useParams } from 'next/navigation';

// Configure mock store with thunk middleware
const middlewares: Middleware<Record<string, unknown>, unknown, Dispatch<AnyAction>>[] = [
  thunk as Middleware<Record<string, unknown>, unknown, Dispatch<AnyAction>>,
];
const mockStore = configureStore<unknown, AnyAction>(middlewares);

jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}));

jest.mock("../../store/taskSlice", () => ({
  ...jest.requireActual("../../store/taskSlice"),
  fetchTasks: jest.fn(() => () => Promise.resolve([])),
}));

describe('TaskDetails Component', () => {
  let store: ReturnType<typeof mockStore>;

  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation((msg) => {
      if (typeof msg === "string" && msg.includes("XMLHttpRequest")) return;
      console.warn(msg);
    });
  });

  beforeEach(() => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });

    store = mockStore({
      task: {
        tasks: [
          { _id: '1', title: 'Test Task', description: 'Test Description', status: 'pending' },
        ],
        loading: false,
      },
    });
  });

  it('renders without crashing', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <TaskDetails />
        </Provider>
      );
    });
    expect(screen.getByText(/Task Details/i)).toBeInTheDocument();
  });

  it('displays the correct task details', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <TaskDetails />
        </Provider>
      );
    });

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('shows loading state initially', async () => {
    store = mockStore({
      task: {
        tasks: [],
        loading: true,
      },
    });
    await act(async () => {
      render(
        <Provider store={store}>
          <TaskDetails />
        </Provider>
      );
    });
    expect(screen.getByText(/Loading task details.../i)).toBeInTheDocument();
  });

  it('shows task not found if task is missing', async () => {
    store = mockStore({
      task: {
        tasks: [],
        loading: false,
      },
    });
    await act(async () => {
      render(
        <Provider store={store}>
          <TaskDetails />
        </Provider>
      );
    });
    expect(screen.getByText(/Task not found/i)).toBeInTheDocument();
  });
});
