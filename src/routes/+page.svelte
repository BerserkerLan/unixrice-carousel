<!-- page.svelte -->
<script lang="ts">
    import { _carouselItems } from './+page';
    import { ButtonGroup} from 'sveltestrap';
    import {
    DropdownItem,
    DropdownMenu,
    Button,
    Dropdown,
    DropdownToggle
  } from 'sveltestrap';
  import {Icon} from 'sveltestrap'

    let openDE = false;
    let openSort = false;
    let selectedDEValue = 'GNOME'
    let selectedSortValue = 'relevance'
    let imageQualityValue = 'HQ'
    let loaded = false;
    let currentImageIndex = 0;
    export var images: any[] = []
    let activeIndex = 0;

    function increaseImageIndex() {
      if (currentImageIndex < images.length) {
        currentImageIndex++
      }
    }

    function decreaseImageIndex() {
      if (currentImageIndex >= 0) {
        currentImageIndex--
      }
    }

    function handleKeyDown(event) {
      if (event.key === "ArrowUp") {
      // Do something when up arrow is pressed
      } else if (event.key === "ArrowDown") {
        // Do something when down arrow is pressed
      } else if (event.key === "ArrowLeft") {
        decreaseImageIndex()

      } else if (event.key === "ArrowRight") {
        increaseImageIndex()
      }
    }

    function handleHighQualityButton() {
      imageQualityValue = 'HQ'
    }

    function handleLowQualityButton() {
      imageQualityValue = 'LQ'
    }

    function handleDESelect(value) {
      selectedDEValue = value;
      openDE = false;
    }

    function handleSortSelect(value) {
      selectedSortValue = value;
      openSort = true;
    }
  
    async function fetchData() {
      images = []
      loaded = false
      const response = await fetch(`https://www.reddit.com/r/unixporn/search.json?q=` + selectedDEValue + `&restrict_sr=on&include_over_18=on&sort=` + selectedSortValue + `&t=all&limit=500`);
      const jsonResponse = await response.json();
      let childrenList = jsonResponse["data"]["children"]
      for (let i = 0; i < childrenList.length; i++) {
        console.log("event: " + JSON.stringify(childrenList[i]))
        let imageURL = childrenList[i]["data"]["url_overridden_by_dest"]
        if (imageURL.includes('v.redd.it') || imageURL.includes('youtu.be')) {
          continue
        }
        let carouselItem = {
          id: i,
          name: childrenList[i]["data"]["title"],
          imageurl: childrenList[i]["data"]["url_overridden_by_dest"],
          href: "http://www.reddit.com" + childrenList[i]["data"]["permalink"],
          lqimageurl: childrenList[i]["data"]["thumbnail"]
        }
        images.push(carouselItem)
      }
      console.log(images)
      loaded = true;
    }
  </script>
    

<svelte:head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css">
</svelte:head>

<svelte:window
  on:keydown={handleKeyDown}/>

  <div class="flex justify-center">
    <Dropdown class="pr-6">
      <DropdownToggle on:click={() => openDE = !openDE}>{selectedDEValue}</DropdownToggle>
      <DropdownMenu bind:open={openDE}>
        <DropdownItem on:click={() => handleDESelect('GNOME')}>
          GNOME
        </DropdownItem>
        <DropdownItem on:click={() => handleDESelect('KDE')}>
          KDE
        </DropdownItem>
        <DropdownItem  on:click={() => handleDESelect('i3')}>
          i3
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>

    <Dropdown class="pr-6">
      <DropdownToggle on:click={() => openSort = !openSort}>{selectedSortValue}</DropdownToggle>
      <DropdownMenu bind:open={openSort}>
        <DropdownItem on:click={() => handleSortSelect('relevance')}>
          relevance
        </DropdownItem>
        <DropdownItem on:click={() => handleSortSelect('hot')}>
          hot
        </DropdownItem>
        <DropdownItem  on:click={() => handleSortSelect('top')}>
          top
        </DropdownItem>
        <DropdownItem  on:click={() => handleSortSelect('new')}>
          new
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>

    <!-- <ButtonGroup>
      <Button active on:click={handleHighQualityButton}>HQ Images</Button>
      <Button on:click={handleLowQualityButton}>LQ Images</Button>
    </ButtonGroup> -->


    <Button on:click={fetchData} color='success'>Search</Button>
</div>

  {#if loaded}
  <i class="fa-solid fa-arrow-left"></i>
      {#if imageQualityValue == 'HQ'}
        <img src={images[currentImageIndex].imageurl} class="d-block w-100" alt={`${images[currentImageIndex].title} ${currentImageIndex + 1}`} />
      {/if}
      {#if imageQualityValue == 'LQ'}
        <img src={images[currentImageIndex].lqimageurl} class="d-block w-100" alt={`${images[currentImageIndex].title} ${currentImageIndex + 1}`} />
      {/if}
      <div class="relative">
        <a class="z-40" href={images[currentImageIndex].href} color='success'>Reddit Link</a>
      </div>
  <!-- <Carousel class="pt-7" {images} bind:activeIndex interval={-1}>
    <div class="carousel-inner">
      {#each images as item, index}
        <CarouselItem class="relative space-x-4" bind:activeIndex itemIndex={index}>
          <div class="relative">
            {#if imageQualityValue == 'HQ'}
              <img src={item.imageurl} class="d-block w-100" alt={`${item.title} ${index + 1}`} />
            {/if}
            {#if imageQualityValue == 'LQ'}
              <img src={item.lqimageurl} class="d-block w-100" alt={`${item.title} ${index + 1}`} />
            {/if}
          </div>
          <div class="relative">
            <a class="z-40" href={item.href} color='success'>Reddit Link</a>
          </div>
        </CarouselItem>
      {/each}
    </div>
  
  </Carousel> -->
{/if}  



  