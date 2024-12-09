import moment, { Moment } from "moment";

/**
 * Draw time frame weekly view
 * @param day
 */
export const drawTimeFrameWeekly = (day: Moment) => {
  const dayElement = document.querySelector(
    `.day[day="${day.format("YYYY-MM-DD")}"]`
  );

  if (dayElement) {
    const listTimeFrame = Array.from(
      dayElement.querySelectorAll(`.time-frame`)
    );
    if (listTimeFrame.length > 0) {
      const heightTimeFrame = (<HTMLElement>listTimeFrame[0]).offsetHeight;
      (<HTMLElement>dayElement).style.height = `${
        heightTimeFrame * (listTimeFrame.length + 1)
      }px`;
      listTimeFrame.forEach((timeFrame, index) => {
        const startTimeAttribute = timeFrame.getAttribute("start-time");
        const endTimeAttrAttribute = timeFrame.getAttribute("end-time");

        const { left, width } = calculatorUITimeFrame(
          moment(startTimeAttribute),
          moment(endTimeAttrAttribute)
        );
        const widthTitle = (<HTMLElement>document.querySelector(".hour__title"))
          .offsetWidth;
        (<HTMLElement>timeFrame).style.top = `${
          index === 0
            ? heightTimeFrame * index
            : heightTimeFrame * index + 1 * index
        }px`;
        (<HTMLElement>timeFrame).style.left = `${widthTitle + left}px`;
        (<HTMLElement>timeFrame).style.width = width + "px";

        setPositionTooltipTimeFrameDaily(timeFrame as HTMLElement);
      });
    }
  }
};

/**
 * Set Position tooltip of time frame daily
 */
const setPositionTooltipTimeFrameDaily = (timeFrame: HTMLElement) => {
  const toolTip = timeFrame.querySelector(".tooltip");
  if (toolTip) {
    if (timeFrame.offsetLeft < 300) {
      toolTip.classList.add("right");
    } else {
      toolTip.classList.add("left");
    }
  }
};

/**
 * Draw time frame on daily calendar view
 */
export const drawTimeFrameEventDailyView = () => {
  const dayElement = document.querySelector(`.list-event`);

  if (dayElement) {
    const listTimeFrame = Array.from(
      dayElement.querySelectorAll(`.time-frame`)
    );

    if (listTimeFrame.length > 0) {
      const heightTimeFrame = (<HTMLElement>listTimeFrame[0]).offsetHeight;
      (<HTMLElement>dayElement).style.height = `${
        heightTimeFrame * (listTimeFrame.length + 1)
      }px`;
      listTimeFrame.forEach((timeFrame, index) => {
        const startTimeAttribute = timeFrame.getAttribute("start-time");
        const endTimeAttrAttribute = timeFrame.getAttribute("end-time");
        const { left, width } = calculatorUITimeFrame(
          moment(startTimeAttribute),
          moment(endTimeAttrAttribute)
        );
        const widthTitle = (<HTMLElement>(
          document.querySelector(".event__title")
        )).offsetWidth;
        (<HTMLElement>timeFrame).style.top = `${
          index === 0
            ? heightTimeFrame * index
            : heightTimeFrame * index + index
        }px`;

        (<HTMLElement>timeFrame).style.left = `${widthTitle + left}px`;
        (<HTMLElement>timeFrame).style.width = width + "px";

        setPositionTooltipTimeFrameDaily(timeFrame as HTMLElement);
      });
    }
  }
};

/**
 * Draw time frame on daily calendar view
 */
export const drawTimeFrameDeviceDailyView = () => {
  const dayElement = document.querySelector(`.list-device`);

  if (dayElement) {
    const listTimeFrame = Array.from(
      dayElement.querySelectorAll(`.time-frame`)
    );

    if (listTimeFrame.length > 0) {
      const heightTimeFrame = (<HTMLElement>listTimeFrame[0]).offsetHeight;
      (<HTMLElement>dayElement).style.height = `${
        heightTimeFrame * (listTimeFrame.length + 1)
      }px`;
      listTimeFrame.forEach((timeFrame, index) => {
        const startTimeAttribute = timeFrame.getAttribute("start-time");
        const endTimeAttrAttribute = timeFrame.getAttribute("end-time");
        const { left, width } = calculatorUITimeFrame(
          moment(startTimeAttribute),
          moment(endTimeAttrAttribute)
        );
        const widthTitle = (<HTMLElement>(
          document.querySelector(".device__title")
        )).offsetWidth;
        (<HTMLElement>timeFrame).style.top = `${
          index === 0
            ? heightTimeFrame * index
            : heightTimeFrame * index + index
        }px`;

        (<HTMLElement>timeFrame).style.left = `${widthTitle + left}px`;
        (<HTMLElement>timeFrame).style.width = width + "px";

        setPositionTooltipTimeFrameDaily(timeFrame as HTMLElement);
      });
    }
  }
};

/**
 * Draw time frame on daily calendar view
 * @param seatId id of seat
 */
export const drawTimeFrameSeatDailyView = (seatId: number) => {
  const dayElement = document.querySelector(`.list-seats[seat-id="${seatId}"]`);

  if (dayElement) {
    const listTimeFrame = Array.from(
      dayElement.querySelectorAll(`.time-frame`)
    );

    if (listTimeFrame.length > 0) {
      const heightTimeFrame = (<HTMLElement>listTimeFrame[0]).offsetHeight;
      (<HTMLElement>dayElement).style.height = `${
        heightTimeFrame * (listTimeFrame.length + 1)
      }px`;
      listTimeFrame.forEach((timeFrame, index) => {
        const startTimeAttribute = timeFrame.getAttribute("start-time");
        const endTimeAttrAttribute = timeFrame.getAttribute("end-time");
        const { left, width } = calculatorUITimeFrame(
          moment(startTimeAttribute),
          moment(endTimeAttrAttribute)
        );
        const widthTitle = (<HTMLElement>document.querySelector(".seat__title"))
          .offsetWidth;
        (<HTMLElement>timeFrame).style.top = `${
          index === 0
            ? heightTimeFrame * index
            : heightTimeFrame * index + 1 * index
        }px`;

        (<HTMLElement>timeFrame).style.left = `${widthTitle + left}px`;
        (<HTMLElement>timeFrame).style.width = width + "px";

        setPositionTooltipTimeFrameDaily(timeFrame as HTMLElement);
      });
    }
  }
};

/**
 * Draw time frame of staff on daily calendar view
 * @param staffId id of staff
 */
export const drawTimeFrameStaffDailyView = (staffId: number) => {
  const dayElement = document.querySelector(
    `.list-staff[staff-id="${staffId}"]`
  );

  if (dayElement) {
    const listTimeFrame = Array.from(
      dayElement.querySelectorAll(`.time-frame`)
    );

    if (listTimeFrame.length > 0) {
      const heightTimeFrame = (<HTMLElement>listTimeFrame[0]).offsetHeight;
      (<HTMLElement>dayElement).style.height = `${
        heightTimeFrame * (listTimeFrame.length + 1)
      }px`;
      listTimeFrame.forEach((timeFrame, index) => {
        const startTimeAttribute = timeFrame.getAttribute("start-time");
        const endTimeAttrAttribute = timeFrame.getAttribute("end-time");
        const { left, width } = calculatorUITimeFrame(
          moment(startTimeAttribute),
          moment(endTimeAttrAttribute)
        );
        const widthTitle = (<HTMLElement>(
          document.querySelector(".staff__title")
        )).offsetWidth;
        (<HTMLElement>timeFrame).style.top = `${
          index === 0
            ? heightTimeFrame * index
            : heightTimeFrame * index + 1 * index
        }px`;

        (<HTMLElement>timeFrame).style.left = `${widthTitle + left}px`;
        (<HTMLElement>timeFrame).style.width = width + "px";

        setPositionTooltipTimeFrameDaily(timeFrame as HTMLElement);
      });
    }
  }
};

const calculatorUITimeFrame = (startTime: Moment, endTime: Moment) => {
  let left = 0;
  let width = 0;

  const hourInDayElement = document.querySelector(".hours-in-day .hour__value");
  if (hourInDayElement) {
    const widthHourInDayElement = (<HTMLElement>hourInDayElement).offsetWidth;
    const widthOneMinute = widthHourInDayElement / 60;

    const diffMinutesStartDay = moment
      .duration(startTime.diff(startTime.clone().startOf("day")))
      .asMinutes();

    const lengthMinutes = moment
      .duration(
        (endTime.isAfter(startTime, "D") === false
          ? endTime
          : startTime.clone().endOf("day")
        ).diff(startTime)
      )
      .asMinutes();

    left = diffMinutesStartDay * widthOneMinute;
    width = lengthMinutes * widthOneMinute;
  }

  return { left, width };
};
