import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../store/users";
import "./MyPeeps.css";
import { fetchMediaThunk } from "../store/media";
import { fetchEventsThunk } from "../store/events";

// ✅ Keep this OUTSIDE the component
function EventName({ eventId }) {
  const event = useSelector(
    (state) =>
      state.events?.[eventId] ??
      state.events?.eventsById?.[eventId] ??
      state.events?.allEvents?.[eventId]
  );

  return <p className="event-name">{event?.name || "Unknown Event"}</p>;
}

function MyPeeps() {
  const dispatch = useDispatch();

  const users = useSelector((state) => state.users.allUsers || []);
  const media = useSelector((state) => state.media || {});
  const mediaArr = Object.values(media);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchMediaThunk());
    dispatch(fetchEventsThunk());
  }, [dispatch]);

  return (
    <div className="page-body">
      <div className="peeps">
        {users.map((user) => {
          // pics uploaded by this user that have an eventId
          const userEventPics = mediaArr.filter(
            (pic) => pic.eventId && Number(pic.userId) === Number(user.id)
          );

          // ✅ Group pics by eventId so event name prints ONCE per event
          const picsByEvent = userEventPics.reduce((acc, pic) => {
            const eid = String(pic.eventId);
            if (!acc[eid]) acc[eid] = [];
            acc[eid].push(pic);
            return acc;
          }, {});

          const eventIds = Object.keys(picsByEvent);

          return (
            <div key={user.id} className="peep">
              <h3>{user.username}</h3>
              <p>{user.email}</p>
              <p>{user.bio || "No Bio..."}</p>

              {/* profile photo */}
              <img className="profile-pic" src={user.photo} alt={user.username} />

              <p>Events</p>

              <div className="event-pics">
                {eventIds.length ? (
                  eventIds.map((eid) => (
                    <div key={eid} className="event-block">
                      {/* ✅ Event name shows ONCE */}
                      <EventName eventId={eid} />

                      {/* show up to 3 pics for that event */}
                      <div className="pics-row">
                        {picsByEvent[eid].slice(0, 3).map((pic) => (
                          <img
                            key={pic.id ?? pic.url}
                            className="pic"
                            src={pic.url}
                            alt="Event"
                          />
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <span>No event pics yet...</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MyPeeps;
