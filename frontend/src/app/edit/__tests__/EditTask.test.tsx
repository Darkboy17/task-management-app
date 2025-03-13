import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import EditTask from '../[id]/page';
import '@testing-library/jest-dom';
import { AnyAction, Dispatch, Middleware } from 'redux';
import { act } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { updateTask } from "../../store/taskSlice";

// Configure mock store with thunk middleware
const middlewares: Middleware<Record<string, unknown>, unknown, Dispatch<AnyAction>>[] = [
  thunk as Middleware<Record<string, unknown>, unknown, Dispatch<AnyAction>>,
];
const mockStore = configureStore<unknown, AnyAction>(middlewares);

jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock("../../store/taskSlice", () => ({
  ...jest.requireActual("../../store/taskSlice"),
  updateTask: jest.fn(() => () => Promise.resolve({})), // ✅ Correctly mock updateTask as a thunk
  fetchTasks: jest.fn(() => () => Promise.resolve([])), // ✅ Ensure fetchTasks is also mocked
}));

describe('EditTask Component', () => {
  let store: ReturnType<typeof mockStore>;
  let mockPush: jest.Mock;

  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation((msg) => {
      if (typeof msg === "string" && msg.includes("XMLHttpRequest")) return;
      console.warn(msg);
    });
  });

  beforeEach(() => {
    mockPush = jest.fn();
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    store = mockStore({
      task: {
        tasks: [
          { _id: '1', title: 'Test Task', description: 'Test Description', status: 'pending' },
        ],
        error: null,
        loading: false,
      },
    });
  });

  it('renders without crashing', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <EditTask />
        </Provider>
      );
    });
    expect(screen.getByText(/Edit Task/i)).toBeInTheDocument();
  });

  it('displays the correct task details', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <EditTask />
        </Provider>
      );
    });

    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveValue('pending');
  });

  it('updates input values correctly', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <EditTask />
        </Provider>
      );
    });

    const titleInput = screen.getByPlaceholderText(/Title/i);
    const descriptionInput = screen.getByPlaceholderText(/Description/i);
    const statusSelect = screen.getByRole('combobox');

    fireEvent.change(titleInput, { target: { value: 'Updated Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'Updated Description' } });
    fireEvent.change(statusSelect, { target: { value: 'completed' } });

    expect((titleInput as HTMLInputElement).value).toBe('Updated Task');
    expect((descriptionInput as HTMLInputElement).value).toBe('Updated Description');
    expect((statusSelect as HTMLInputElement).value).toBe('completed');
  });

  it('submits the form and dispatches updateTask action', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <EditTask />
        </Provider>
      );
    });

    fireEvent.change(screen.getByPlaceholderText(/Title/i), { target: { value: 'Updated Task' } });
    fireEvent.change(screen.getByPlaceholderText(/Description/i), { target: { value: 'Updated Description' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'completed' } });

    fireEvent.click(screen.getByText(/Save Changes/i));

    expect(updateTask).toHaveBeenCalledWith({
      id: '1',
      title: 'Updated Task',
      description: 'Updated Description',
      status: 'completed',
    });

    expect(mockPush).toHaveBeenCalledWith('/');
  });
});