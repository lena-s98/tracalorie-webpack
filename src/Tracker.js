import Storage from "./Storage";

class CalorieTracker {
	constructor() {
		this._calorieLimit = Storage.getCalorieLimit();
		this._totalCalories = Storage.getTotalCalories(0);
		this._meals = Storage.getMeals();
		this._workouts = Storage.getWorkouts();

		this._displayCaloriesLimit();
		this._displayCaloriesTotal();
		this._displayCaloriesConsumed();
		this._displayCaloriesBurned();
		this._displayCaloriesRemaining();
		this._displayCaloriesProgress();

		document.querySelector("#limit").value = this._calorieLimit;
	}

	// Public Methods/API //

	addMeal(meal) {
		this._meals.push(meal);
		this._totalCalories += meal.calories;
		Storage.setTotalCalories(this._totalCalories);
		Storage.saveMeal(meal);
		this._displayNewItem(meal, "meal");
		this._render();
	}

	addWorkout(workout) {
		this._workouts.push(workout);
		this._totalCalories -= workout.calories;
		Storage.setTotalCalories(this._totalCalories);
		Storage.saveWorkout(workout);
		this._displayNewItem(workout, "workout");
		this._render();
	}

	removeMeal(id) {
		const index = this._meals.findIndex((meal) => {
			return meal.id === id;
		});

		if (index !== -1) {
			const meal = this._meals[index];
			this._totalCalories -= meal.calories;
			Storage.setTotalCalories(this._totalCalories);
			this._meals.splice(index, 1);
			Storage.removeMeal(id);
			this._render();
		}
	}

	removeWorkout(id) {
		const index = this._workouts.findIndex((workout) => {
			return workout.id === id;
		});

		if (index !== -1) {
			const workout = this._workouts[index];
			this._totalCalories += workout.calories;
			Storage.setTotalCalories(this._totalCalories);
			this._workouts.splice(index, 1);
			Storage.removeWorkout(id);
			this._render();
		}
	}

	reset() {
		this._totalCalories = 0;
		this._meals = [];
		this._workouts = [];
		Storage.clearAll();
		this._render();
	}

	setLimit(calorieLimit) {
		this._calorieLimit = calorieLimit;
		Storage.setCalorieLimit(calorieLimit);
		this._displayCaloriesLimit();
		this._render();
	}

	loadItems() {
		this._meals.forEach((meal) => this._displayNewItem(meal, "meal"));
		this._workouts.forEach((workout) =>
			this._displayNewItem(workout, "workout")
		);
	}

	// Private Methods //

	_displayCaloriesLimit() {
		const calorieLimitEl = document.querySelector("#calories-limit");
		calorieLimitEl.innerHTML = this._calorieLimit;
	}

	_displayCaloriesTotal() {
		const totalCaloriesEl = document.querySelector("#calories-total");
		totalCaloriesEl.innerHTML = this._totalCalories;
	}

	_displayCaloriesConsumed() {
		const caloriesConsumedEl = document.querySelector("#calories-consumed");

		const consumed = this._meals.reduce((total, meal) => {
			return total + meal.calories;
		}, 0);

		caloriesConsumedEl.innerHTML = consumed;
	}

	_displayCaloriesBurned() {
		const caloriesBurnedEl = document.querySelector("#calories-burned");

		const burned = this._workouts.reduce((total, workout) => {
			return total + workout.calories;
		}, 0);

		caloriesBurnedEl.innerHTML = burned;
	}

	_displayCaloriesRemaining() {
		const caloriesRemainingEl = document.querySelector("#calories-remaining");
		const progressEl = document.querySelector("#calorie-progress");

		const remaining = this._calorieLimit - this._totalCalories;

		caloriesRemainingEl.innerHTML = remaining;

		if (remaining < 0) {
			caloriesRemainingEl.parentElement.parentElement.classList.remove(
				"bg-light"
			);
			caloriesRemainingEl.parentElement.parentElement.classList.add(
				"bg-danger"
			);
			progressEl.classList.remove("bg-success");
			progressEl.classList.add("bg-danger");
		} else {
			caloriesRemainingEl.parentElement.parentElement.classList.remove(
				"bg-danger"
			);
			caloriesRemainingEl.parentElement.parentElement.classList.add("bg-light");
			progressEl.classList.remove("bg-danger");
			progressEl.classList.add("bg-success");
		}
	}

	_displayCaloriesProgress() {
		const progressEl = document.querySelector("#calorie-progress");

		const percentage = (this._totalCalories / this._calorieLimit) * 100;

		const width = Math.min(percentage, 100);

		progressEl.style.width = `${width}%`;
	}

	_displayNewItem(obj, type) {
		const cardDiv = document.createElement("div");
		cardDiv.classList.add("card", "my-2");
		cardDiv.setAttribute("data-id", obj.id);

		const cardBodyDiv = document.createElement("div");
		cardBodyDiv.classList.add("card-body");

		const alignmentDiv = document.createElement("div");
		alignmentDiv.classList.add(
			"d-flex",
			"align-items-center",
			"justify-content-between"
		);

		const h4 = document.createElement("h4");
		h4.classList.add("mx-1");
		h4.textContent = `${obj.name}`;

		const valueDiv = document.createElement("div");
		valueDiv.classList.add(
			"fs-1",
			"text-white",
			"text-center",
			"rounded-2",
			"px-2",
			"px-sm-5"
		);
		valueDiv.textContent = `${obj.calories}`;

		const button = document.createElement("button");
		button.classList.add("delete", "btn", "btn-danger", "btn-sm", "mx-2");

		const icon = document.createElement("i");
		icon.classList.add("fa-solid", "fa-xmark");

		button.appendChild(icon);
		alignmentDiv.appendChild(h4);
		alignmentDiv.appendChild(valueDiv);
		alignmentDiv.appendChild(button);
		cardBodyDiv.appendChild(alignmentDiv);
		cardDiv.appendChild(cardBodyDiv);

		if (type === "meal") {
			const mealItems = document.querySelector("#meal-items");
			mealItems.appendChild(cardDiv);

			valueDiv.classList.add("bg-primary");
		} else {
			const workoutItems = document.querySelector("#workout-items");
			workoutItems.appendChild(cardDiv);

			valueDiv.classList.add("bg-secondary");
		}
	}

	_render() {
		this._displayCaloriesTotal();
		this._displayCaloriesConsumed();
		this._displayCaloriesBurned();
		this._displayCaloriesRemaining();
		this._displayCaloriesProgress();
	}
}

export default CalorieTracker;
