const init = () => [
  {
    intro: "How to use Bilkent scheduler?",
  },
  {
    element: "#semester-selector",
    intro: "Firstly, you need to select a semester!",
    position: "right",
  },
  {
    element: "#course-selector",
    intro:
      "Then, you need to select some courses from the list to be able to do some magic with them!",
    position: "left",
  },
  {
    element: "#content",
    intro: "Abracadabra and tada! Your schedules are ready. Let's get to work!",
    position: "top",
  },
  {
    element: "#filter",
    intro: "Filter prepared schedules by instructors as you wish",
    position: "right",
  },
  {
    element: "#capture-button",
    intro: "Export any of your schedule as PNG whenever you want!",
    position: "top",
  },
  {
    element: document.querySelector("#schedule-table .locked"),
    intro: "Keep any timeslot you wish empty. Just lock it by clicking on!",
    position: "left",
  },
  {
    element: "#pagination",
    intro:
      "Navigate among all schedules by using pagination or arrow keys on your keyboard!",
    position: "top",
  },
  {
    intro:
      "That's all. You are ready to use Bilkent scheduler. May the force be with you!",
  },
];

export default init;
