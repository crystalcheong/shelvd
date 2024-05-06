import { Logo } from '@/components/Layout.Logo'
import Search from '@/components/Layout.Search'
import { ThemeButton } from '@/components/Theme.Button'
import { RenderGuard } from '@/components/providers/render.provider'
import { Button, ButtonProps } from '@/components/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog'
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from '@/components/ui/Drawer'
import { AppRepository } from '@/data/static/app'
import { AppActions, AppSelectors } from '@/data/stores/app.slice'
import { useRootDispatch, useRootSelector } from '@/data/stores/root'
import { env } from '@/env'
import { useNavigate } from '@/router'
import { logger } from '@/utils/debug'

import { cn } from '@/utils/dom'
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from '@clerk/clerk-react'
import { DialogProps } from '@radix-ui/react-dialog'
import {
  GitHubLogoIcon,
  HamburgerMenuIcon,
  MagnifyingGlassIcon,
  QuestionMarkCircledIcon,
} from '@radix-ui/react-icons'
import { ComponentProps, PropsWithChildren, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { toast } from 'sonner'

export const AuthButton = () => {
  const { pathname } = useLocation()

  return (
    <>
      <SignedOut>
        <SignInButton
          mode={'modal'}
          afterSignInUrl={pathname}
          afterSignUpUrl={pathname}
        >
          <Button>Login</Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton
          userProfileMode="modal"
          afterSignOutUrl={pathname}
          afterSwitchSessionUrl={pathname}
          afterMultiSessionSingleSignOutUrl={pathname}
        />
      </SignedIn>
    </>
  )
}

export const Nav = () => {
  const { pathname } = useLocation()

  const [isServerToastShown, setIsServerToastShown] = useState<boolean>(false)
  const [isServerDown] = [
    useRootSelector(AppSelectors.state).serverMaintainanceVisibility,
  ]

  let count = 0

  useEffect(() => {
    if (!pathname) return
    console.groupEnd()
    console.group(pathname)
    window.scrollTo(0, 0)

    if (isServerDown && !count) {
      toast.warning('Unmaintained Server', {
        description: 'Content may be outdated as a result.',
        action: {
          label: 'Why? 🤷‍♀️',
          onClick: () => {
            setIsServerToastShown(true)
          },
        },
      })
      count++
    }
  }, [count, isServerDown, pathname])

  return (
    <RenderGuard renderIf={!!pathname}>
      <nav
        className={cn(
          'transition-all',
          'sticky inset-x-0 top-0 z-40',
          'py-3',
          'border-b bg-background/30 backdrop-blur',
        )}
      >
        <main className="container flex flex-row place-content-between place-items-center gap-2 py-2">
          <Logo />

          <div className={cn('flex flex-row place-items-center gap-2')}>
            <Search.Command />

            <DrawerMenu
              direction="right"
              trigger={{
                className: 'hidden sm:inline-flex',
              }}
            />

            <ThemeButton />

            <AuthButton />
          </div>
        </main>
      </nav>

      <BottomNav>
        <Nav.About
          open={isServerToastShown}
          onOpenChange={setIsServerToastShown}
        />
      </BottomNav>
    </RenderGuard>
  )
}

type NavAbout = DialogProps
const NavAbout = (props: NavAbout) => {
  return (
    <Dialog {...props}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
        >
          <QuestionMarkCircledIcon />
          <span className="sr-only">About</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col flex-wrap overflow-hidden sm:max-w-md">
        <DialogHeader className="w-full text-pretty">
          <DialogTitle className="max-w-full truncate text-pretty">
            About
          </DialogTitle>
          <DialogDescription className="max-w-prose text-pretty text-start">
            This repository is submitted as a project work for Nanyang
            Technological University's SC3040 - Advanced Software Engineering
            course.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-row flex-wrap place-items-center gap-2 sm:justify-start">
          <Button
            variant={'link'}
            className="h-auto p-0"
          >
            <a
              href={AppRepository}
              target="_blank"
              className="inline-flex flex-row place-items-center gap-1"
            >
              <GitHubLogoIcon className="size=4" />
              <span>Repository</span>
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
Nav.About = NavAbout

type BottomNav = PropsWithChildren
export const BottomNav = ({ children }: BottomNav) => {
  const dispatch = useRootDispatch()
  const { setSearchCommandVisibility } = AppActions

  return (
    <nav
      className={cn(
        'transition-all sm:hidden',
        'fixed inset-x-0 bottom-4 z-40',
        'h-16 py-2',
        'border-b bg-background/30 backdrop-blur',
      )}
    >
      <main className="container flex h-full flex-row place-content-between place-items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            dispatch(setSearchCommandVisibility(true))
          }}
        >
          <MagnifyingGlassIcon className="size-4" />
        </Button>
        <DrawerMenu />

        {children}
      </main>
    </nav>
  )
}

type DrawerMenu = ComponentProps<typeof Drawer> & {
  trigger?: ButtonProps
  content?: ComponentProps<typeof DrawerContent>
}
const DrawerMenu = ({ trigger, content, direction, ...props }: DrawerMenu) => {
  const navigate = useNavigate()
  // const { pathname } = useLocation()

  const { user } = useUser()
  // const username = user?.username ?? ''
  // const isValidUsername = !!username.length

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)

  logger({ breakpoint: '[Layout.Nav.tsx:139]' }, { user })
  return (
    <Drawer
      open={isDrawerOpen}
      onOpenChange={setIsDrawerOpen}
      direction={direction}
      {...props}
    >
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          {...trigger}
        >
          <HamburgerMenuIcon className="size-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent
        {...content}
        className={cn(
          '!my-0 gap-y-4 px-6 pb-6',
          direction === 'right' && 'inset-x-auto right-0 h-full',
          direction === 'top' && ' max-h-[50dvh]',
          content?.className,
        )}
      >
        <Button
          variant="outline"
          onClick={() => {
            setIsDrawerOpen(false)
            navigate({
              pathname: '/trending',
            })
          }}
        >
          Trending
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            setIsDrawerOpen(false)
            navigate({
              pathname: '/discover',
            })
          }}
        >
          Discover
        </Button>

        <Button
          variant="outline"
          className={cn(!env.VITE_FEATURE_COLLECTIONS && 'hidden')}
          onClick={() => {
            setIsDrawerOpen(false)
            navigate({
              pathname: '/collections',
            })
          }}
        >
          Collections
        </Button>

        <DrawerFooter className="p-0">
          <SignedIn>
            <Button
              variant="outline"
              onClick={() => {
                setIsDrawerOpen(false)
                navigate(
                  {
                    pathname: `/:username`,
                  },
                  {
                    params: {
                      username: `@${user?.username ?? ''}`,
                    },
                  },
                )
              }}
            >
              Profile
            </Button>
          </SignedIn>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
