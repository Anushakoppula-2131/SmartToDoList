import { gapi } from "gapi-script";

const CLIENT_ID = "149676302457-hgfkug8t95dfd6uknimjpugfkeg9jdvf.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

export const initializeGoogleAuth = () => {
  return new Promise((resolve, reject) => {
    gapi.load("client:auth2", () => {
      gapi.client
        .init({
          clientId: CLIENT_ID,
          scope: SCOPES,
          discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
        })
        .then(() => {
          resolve(gapi.auth2.getAuthInstance());
        })
        .catch((error) => {
          console.error("Google Auth Initialization Error:", error);
          reject(error);
        });
    });
  });
};


const formatDateTime = (dateString) => {
  if (!dateString) {
    console.error("Missing date input:", dateString);
    return new Date().toISOString(); // Default 
  }

  // If already in ISO format, return it
  if (dateString.includes("T") && dateString.includes("Z")) {
    return dateString;
  }

  try {
    // Convert "yyyy-mm-dd HH:MM" to ISO
    const [datePart, timePart] = dateString.split(" ");
    if (!datePart || !timePart) {
      console.error("Invalid date format:", dateString);
      return new Date().toISOString();
    }

    const [year, month, day] = datePart.split("-").map(Number);
    const [hours, minutes] = timePart.split(":").map(Number);

    const dateObj = new Date(year, month - 1, day, hours, minutes);
    if (isNaN(dateObj.getTime())) {
      console.error("Invalid date:", dateString);
      return new Date().toISOString();
    }

    return dateObj.toISOString(); // Convert to ISO format
  } catch (error) {
    console.error("Error during Date conversion error:", error);
    return new Date().toISOString();
  }
};

//adding event
export const addEventToGoogleCalendar = async (task, updateTask) => {
  try {
    const authInstance = await initializeGoogleAuth();

    if (!authInstance.isSignedIn.get()) {
      await authInstance.signIn();
    }

    if (!task.startDateTime || !task.endDateTime) {
      alert("Task must have a valid start and end date/time.");
      console.error("Task is missing startDateTime or endDateTime:", task);
      return;
    }

    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const event = {
      summary: task.title,
      description: task.description || "No description provided",
      start: {
        dateTime: formatDateTime(task.startDateTime), 
        timeZone: userTimeZone,
      },
      end: {
        dateTime: formatDateTime(task.endDateTime), 
        timeZone: userTimeZone,
      },
    };

    const response = await gapi.client.calendar.events.insert({
      calendarId: "primary",
      resource: event,
    });

    if (response.result && response.result.id) {
      alert("Event added successfully to Google Calendar! 🎉");

      // Storing the Google Calendar event ID in the task
      updateTask({ ...task, eventId: response.result.id });
    } else {
      throw new Error("Event creation failed.");
    }
  } catch (error) {
    console.error("Google Calendar API Error:", error);
    alert("Failed to add event. Check the console for details.");
  }
};

//deleting event
export const deleteEventFromGoogleCalendar = async (task, deleteTask) => {
  try {
    const authInstance = await initializeGoogleAuth();

    if (!authInstance.isSignedIn.get()) {
      await authInstance.signIn();
    }

    if (!task.eventId) {
      console.warn("No associated Google Calendar event ID found.");
      deleteTask(task.id);
      return;
    }

    try {
      await gapi.client.calendar.events.get({
        calendarId: "primary",
        eventId: task.eventId,
      });

      await gapi.client.calendar.events.delete({
        calendarId: "primary",
        eventId: task.eventId,
      });

      alert("Event deleted from Google Calendar!");
    } catch (error) {
      console.warn("Google Calendar event not found or already deleted.");
    }

    deleteTask(task.id);
  } catch (error) {
    console.error("Google Calendar Delete Error:", error);
    alert("Failed to delete event from Google Calendar.");
  }
};