import { test, expect } from "@playwright/test";
test("preview workflow, help, persistence and reset", async ({ page }) => {
  await page.goto("/");
  await page.getByText("Development workshop").click();
  await page.locator("input[type=date]").fill("2026-11-20");
  await expect(page.getByLabel("Your answer")).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Open .* December/ }),
  ).toHaveCount(0);
  for (let i = 0; i < 2; i++) {
    await page.getByLabel("Your answer").fill("wrong");
    await page.getByRole("button", { name: "Reveal the magic" }).click();
  }
  await expect(page.locator(".choices button")).toHaveCount(4);
  await page.reload();
  await expect(page.locator(".choices button")).toHaveCount(4);
  await page.getByRole("button", { name: "Gehry", exact: false }).click();
  await expect(page.locator(".clue")).toBeVisible();
  await page.getByRole("button", { name: "Reset preview" }).click();
  await expect(page.getByLabel("Your answer")).toBeVisible();
});
test("past doors, completion, return and mobile layout", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByText("Development workshop").click();
  await page.locator("input[type=date]").fill("2026-12-11");
  await expect(
    page.getByRole("button", { name: /Open .* December/ }),
  ).toHaveCount(10);
  await page
    .getByRole("button", { name: "Open 1 December", exact: true })
    .click();
  await expect(page.locator(".opening")).toBeVisible();
  await expect(page.locator("#question-heading")).toContainText("Guggenheim");
  await page.getByLabel("Your answer").fill("Фрэнк Гери");
  await page.getByRole("button", { name: "Reveal the magic" }).click();
  await expect(page.locator(".clue")).toBeVisible();
  await page.getByRole("button", { name: /Follow the lights/ }).click();
  await expect(page.locator("h2#question-heading")).toContainText("Lake Bled");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({ path: "test-results/mobile.png", fullPage: true });
});

test("London midnight clears preview and opens real Day 1", async ({
  page,
}) => {
  await page.clock.install({ time: new Date("2026-11-30T23:59:58Z") });
  await page.goto("/");
  await page.getByLabel("Your answer").fill("Gehry");
  await page.getByRole("button", { name: "Reveal the magic" }).click();
  await expect(page.locator(".clue")).toBeVisible();
  await page.clock.fastForward(3000);
  await expect(page.getByLabel("Your answer")).toBeVisible();
  await expect(page.getByText("TODAY")).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Open .* December/ }),
  ).toHaveCount(0);
});
test("finale and reduced motion keep missed days playable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByText("Development workshop").click();
  await page.locator("input[type=date]").fill("2026-12-25");
  await expect(
    page.getByRole("button", { name: /Open .* December/ }),
  ).toHaveCount(24);
  await page
    .getByRole("button", { name: "Open 24 December", exact: true })
    .click();
  await expect(page.locator("#question-heading")).toContainText(
    "Sugar Plum Fairy",
  );
  await page.getByLabel("Your answer").fill("Щелкунчик");
  await page.getByRole("button", { name: "Reveal the magic" }).click();
  await expect(page.locator(".eve")).toBeVisible();
  await page.getByRole("button", { name: /Follow the lights/ }).click();
  await expect(page.locator(".christmas")).toBeVisible();
  await page.screenshot({ path: "test-results/desktop.png", fullPage: true });
});

test('wish creates a visible star flight and fairy, and can be replayed', async ({page}) => {
  await page.goto('/');
  await page.getByRole('button',{name:'Make a wish',exact:true}).click();
  await expect(page.locator('.wish-magic-canvas')).toBeVisible();
  await expect(page.locator('.wish-fairy-image')).toHaveClass(/is-loaded/);
  await page.waitForFunction(()=>Number(getComputedStyle(document.querySelector('.wish-fairy')!).opacity)>.8);
  const lit=await page.locator('.wish-magic-canvas').evaluate((canvas:HTMLCanvasElement)=>{const c=canvas.getContext('2d')!;return c.getImageData(0,0,canvas.width,canvas.height).data.some((v,i)=>i%4===3&&v>0)});
  expect(lit).toBe(true);
  await page.screenshot({path:'test-results/wish-magic.png'});
  await page.getByRole('button',{name:'Skip',exact:true}).click();
  await expect(page.locator('.wish-magic-sky')).toHaveCount(0);
  await expect(page.locator('.app')).toHaveClass(/awakened/);
  await page.getByRole('button',{name:'Make another wish',exact:true}).click();
  await expect(page.locator('.wish-magic-canvas')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.wish-magic-sky')).toHaveCount(0);
});

test('reduced motion wish completes and leaves the form usable',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  await page.getByRole('button',{name:'Make a wish',exact:true}).click();
  await expect(page.locator('.wish-magic-reduced')).toBeVisible();
  await expect(page.getByRole('button',{name:'Make another wish',exact:true})).toBeEnabled({timeout:4000});
  await page.getByLabel('Your answer').fill('Gehry');
  await page.getByRole('button',{name:'Reveal the magic'}).click();
  await expect(page.locator('.clue')).toBeVisible();
});
