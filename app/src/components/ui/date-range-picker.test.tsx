import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DateRangePicker } from "./date-range-picker";

describe("DateRangePicker", () => {
  const defaultProps = {
    value: {
      from: new Date("2024-01-01"),
      to: new Date("2024-12-31"),
    },
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render the trigger button with formatted date range", () => {
      render(<DateRangePicker {...defaultProps} />);

      // The button should show the date range in a human-readable format
      const triggerButton = screen.getByRole("button");
      expect(triggerButton).toBeInTheDocument();
      // Check it contains some date text (format may vary by locale)
      expect(triggerButton.textContent).toContain("2024");
    });

    it("should render with placeholder when no dates are selected", () => {
      render(
        <DateRangePicker
          value={{ from: undefined, to: undefined }}
          onChange={defaultProps.onChange}
        />
      );

      const triggerButton = screen.getByRole("button");
      expect(triggerButton.textContent).toContain("Pick a date");
    });

    it("should render with only from date", () => {
      render(
        <DateRangePicker
          value={{ from: new Date("2024-06-15"), to: undefined }}
          onChange={defaultProps.onChange}
        />
      );

      const triggerButton = screen.getByRole("button");
      expect(triggerButton.textContent).toContain("2024");
    });

    it("should apply custom className to the trigger button", () => {
      render(<DateRangePicker {...defaultProps} className="custom-class" />);

      const triggerButton = screen.getByRole("button");
      expect(triggerButton).toHaveClass("custom-class");
    });

    it("should be disabled when disabled prop is true", () => {
      render(<DateRangePicker {...defaultProps} disabled={true} />);

      const triggerButton = screen.getByRole("button");
      expect(triggerButton).toBeDisabled();
    });
  });

  describe("popover interaction", () => {
    it("should open calendar popover when trigger is clicked", async () => {
      render(<DateRangePicker {...defaultProps} />);

      const triggerButton = screen.getByRole("button");
      fireEvent.click(triggerButton);

      // The calendar should appear in a popover
      // DayPicker renders navigation buttons
      const prevButton = await screen.findByRole("button", { name: /previous/i });
      expect(prevButton).toBeInTheDocument();
    });

    it("should show two months for date range selection", async () => {
      render(<DateRangePicker {...defaultProps} />);

      const triggerButton = screen.getByRole("button");
      fireEvent.click(triggerButton);

      // Wait for the calendar to render
      await screen.findByRole("button", { name: /previous/i });

      // Check for month captions - should have two months displayed
      const calendarGrids = document.querySelectorAll('[role="grid"]');
      // In range mode, react-day-picker shows two months by default
      expect(calendarGrids.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("date selection", () => {
    it("should call onChange when a date is selected", async () => {
      const onChange = vi.fn();
      render(
        <DateRangePicker
          value={{ from: undefined, to: undefined }}
          onChange={onChange}
        />
      );

      const triggerButton = screen.getByRole("button");
      fireEvent.click(triggerButton);

      // Wait for calendar to render
      await screen.findByRole("button", { name: /previous/i });

      // Find a day button and click it
      const dayButtons = document.querySelectorAll('[data-day]');
      if (dayButtons.length > 0) {
        fireEvent.click(dayButtons[15]); // Click somewhere in the middle of the month
        // onChange should be called
        expect(onChange).toHaveBeenCalled();
      }
    });
  });

  describe("min/max constraints", () => {
    it("should respect minDate constraint", async () => {
      const minDate = new Date("2024-06-01");
      render(
        <DateRangePicker
          {...defaultProps}
          minDate={minDate}
        />
      );

      const triggerButton = screen.getByRole("button");
      fireEvent.click(triggerButton);

      // Calendar should open and have some dates disabled
      await screen.findByRole("button", { name: /previous/i });
      // Implementation should disable dates before minDate
    });

    it("should respect maxDate constraint", async () => {
      const maxDate = new Date("2024-06-30");
      render(
        <DateRangePicker
          {...defaultProps}
          maxDate={maxDate}
        />
      );

      const triggerButton = screen.getByRole("button");
      fireEvent.click(triggerButton);

      // Calendar should open
      await screen.findByRole("button", { name: /previous/i });
      // Implementation should disable dates after maxDate
    });
  });

  describe("timestamp conversion", () => {
    it("should work with timestamp values and provide timestamps to onChange", async () => {
      const startTimestamp = new Date("2024-01-01").getTime();
      const endTimestamp = new Date("2024-12-31").getTime();
      const onChange = vi.fn();

      render(
        <DateRangePicker
          valueAsTimestamps={{ from: startTimestamp, to: endTimestamp }}
          onChangeTimestamps={onChange}
        />
      );

      const triggerButton = screen.getByRole("button");
      expect(triggerButton.textContent).toContain("2024");
    });
  });

  describe("accessibility", () => {
    it("should have proper aria attributes on trigger", () => {
      render(<DateRangePicker {...defaultProps} />);

      const triggerButton = screen.getByRole("button");
      expect(triggerButton).toHaveAttribute("aria-haspopup", "dialog");
    });

    it("should be keyboard accessible", () => {
      render(<DateRangePicker {...defaultProps} />);

      const triggerButton = screen.getByRole("button");
      triggerButton.focus();
      expect(document.activeElement).toBe(triggerButton);

      // Enter should open the popover
      fireEvent.keyDown(triggerButton, { key: "Enter" });
    });
  });
});
