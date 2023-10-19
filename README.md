# Metro system

This application is a metro train schedule analyzer.

### Content

* [Features](#features-)
* [Application](#application)
* [Endpoints](#endpoints)
    * [Auth](#post-apiv1authregister)
    * [User](#get-apiv1usersid)
    * [Schedule](#post-apiv1schedule)
* [Objects](#objects)
    * [User](#user)
    * [Schedule](#schedule)
    * [ScheduleRequest](#schedulerequest)
    * [FlowMeasurement](#flowmeasurement)
    * [ExceptionMessage](#exceptionmessage)
    * [LoginRequest](#loginrequest)
    * [LoginResponse](#loginresponse)

### Features:

* Users can input the number of train cars, passenger capacity, and passenger flow at different times of the day.
* The system calculates intervals between trains and provides capacity information.

### Application

This application uses Express, Redis. Passwords are encrypted using BCrypt-10.

**Configs:**

* `port` - server port
* `redisURL` - URL of Redis

This application is accessible via REST.

## Endpoints

### `POST /api/v1/auth/register`

Creates new user.

**Request:** [`User`](#user).

**Response:**

| Code              | Body                                    | Condition                        |
|-------------------|-----------------------------------------|----------------------------------|
| `201 Created`     | none                                    | If user successfully registered. |
| `400 Bad Request` | [`ExceptionMessage`](#exceptionmessage) | If registration failed.          |

### `GET /api/v1/auth/login`

Authenticates user.

**Request:** [`LoginRequest`](#loginrequest).

**Response:**

| Code              | Body                                    | Condition                       |
|-------------------|-----------------------------------------|---------------------------------|
| `200 OK`          | [`LoginResponse`](#loginresponse)       | Correct credentials are used.   |
| `400 Bad Request` | [`ExceptionMessage`](#exceptionmessage) | Incorrect credentials are used. |

### `GET /api/v1/users/:id`

Returns user by its ID.

**Request:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id`      | long | Yes      | User ID.    |

**Response:**

| Code            | Body                                    | Condition                  |
|-----------------|-----------------------------------------|----------------------------|
| `200 OK`        | [`User`](#user)                         | User is authenticated.     |
| `403 Forbidden` | [`ExceptionMessage`](#exceptionmessage) | User is not authenticated. |

### `GET /api/v1/users/:id/schedules`

Returns list of user`s created schedules by its ID.

**Request:**

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| `id`      | string | Yes      | User ID.    |

**Response:**

| Code            | Body                                    | Condition                  |
|-----------------|-----------------------------------------|----------------------------|
| `200 OK`        | [`Schedule[]`](#Schedule)               | User is authenticated.     |
| `403 Forbidden` | [`ExceptionMessage`](#exceptionmessage) | User is not authenticated. |

### `POST /api/v1/schedule`

Creates schedule with provided params.

**Request:** [`ScheduleRequest`](#schedulerequest).

**Response:**

| Code            | Body                                    | Condition                  |
|-----------------|-----------------------------------------|----------------------------|
| `200 OK`        | [`Schedule`](#schedule)                 | User is authenticated.     |
| `403 Forbidden` | [`ExceptionMessage`](#exceptionmessage) | User is not authenticated. |

## Objects

### `User`

```json
{
  "id": 1,
  "name": "Bob",
  "username": "example@example.com",
  "password": "$2a$10$Ot9A8bGd2FgXYhD9dev9h.poIN5bY/GxE6X.7hvL/rlR5b4V2k7hq"
}
```

| Field      | Type   | Required              | Description                                               |
|------------|--------|-----------------------|-----------------------------------------------------------|
| `id`       | long   | Yes (No for creation) | User`s ID.                                                |
| `name`     | string | Yes                   | User`s name.                                              |
| `username` | string | Yes                   | User`s email.                                             |
| `password` | string | Yes                   | Encrypted user`s password for GET, raw password for POST. |

### `Schedule`

```json
{
  "id": 1,
  "authorId": 1,
  "capacity": 150,
  "interval": 80
}
```

| Field      | Type | Required | Description                         |
|------------|------|----------|-------------------------------------|
| `id`       | long | Yes      | Schedule`s ID.                      |
| `authorId` | long | Yes      | Schedule`s author ID.               |
| `capacity` | int  | Yes      | Per-minute capacity of train set.   |
| `interval` | int  | Yes      | Interval between trains in seconds. |

### `ScheduleRequest`

```json
{
  "trains": 5,
  "capacity": 60,
  "flow": [
    {
      "time": "9:15",
      "amount": 300
    },
    {
      "time": "9:25",
      "amount": 280
    },
    {
      "time": "9:35",
      "amount": 240
    }
  ]
}
```

| Field      | Type                                    | Required | Description                                                 |
|------------|-----------------------------------------|----------|-------------------------------------------------------------|
| `trains`   | int                                     | Yes      | Amount of train cars.                                       |
| `capacity` | int                                     | Yes      | Capacity of one train car.                                  |
| `flow`     | [`FlowMeasurement[]`](#flowmeasurement) | Yes      | Not empty array of flow measurements for a particular time. |

### `FlowMeasurement`

```json
{
  "time": "9:15",
  "amount": 300
}
```

| Field    | Type   | Required | Description                   |
|----------|--------|----------|-------------------------------|
| `time`   | string | Yes      | Measurement time.             |
| `amount` | int    | Yes      | Amount of people on platform. |

### `ExceptionMessage`

```json
{
  "message": "Something bad happened."
}
```

| Field     | Type   | Required | Description        |
|-----------|--------|----------|--------------------|
| `message` | string | Yes      | Exception message. |

### `LoginRequest`

```json
{
  "username": "example@example.com",
  "password": "12345678"
}
```

| Field      | Type   | Required | Description      |
|------------|--------|----------|------------------|
| `username` | string | Yes      | User`s email.    |
| `password` | string | Yes      | User`s password. |

### `LoginResponse`

```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcm5hbWUiOiJleGFtcGxlQGV4YW1wbGUuY29tIiwiaWF0IjoxNTE2MjM5MDIyfQ.tCvBDCHd_VjUZ2SaGFdyxKkLYbjq-W0rH6SYHoayU_w",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcm5hbWUiOiJleGFtcGxlQGV4YW1wbGUuY29tIiwiaWF0IjoxNTE2MjM5MDIyfQ.tCvBDCHd_VjUZ2SaGFdyxKkLYbjq-W0rH6SYHoayU_w"
}
```

| Field     | Type   | Required | Description        |
|-----------|--------|----------|--------------------|
| `access`  | string | Yes      | Access JWT token.  |
| `refresh` | string | Yes      | Refresh JWT token. |
