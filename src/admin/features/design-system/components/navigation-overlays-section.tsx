import { MoreHorizontalIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { PreviewGroup, PreviewSection } from "./preview-section";
import { ShellExample } from "./shell-example";

export function NavigationOverlaysSection() {
  return (
    <PreviewSection
      id="navigation-overlays"
      title="ناوبری و پنجره‌ها"
    >
      <PreviewGroup title="زبانه‌ها">
        <Tabs defaultValue="one">
          <TabsList>
            <TabsTrigger value="one">نما اول</TabsTrigger>
            <TabsTrigger value="two">نما دوم</TabsTrigger>
            <TabsTrigger value="three" disabled>غیرفعال</TabsTrigger>
          </TabsList>
          <TabsContent value="one" className="text-body-sm text-muted-foreground">
            محتوای نمای اول.
          </TabsContent>
          <TabsContent value="two" className="text-body-sm text-muted-foreground">
            محتوای نمای دوم.
          </TabsContent>
        </Tabs>
      </PreviewGroup>
      <PreviewGroup title="مسیر صفحه (فقط برای صفحه‌های عمیق‌تر از دو سطح)">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="#navigation-overlays">خانه</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink href="#navigation-overlays">بخش</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>صفحه‌ی فعلی</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </PreviewGroup>
      <PreviewGroup title="منو و راهنما">
        <div className="flex flex-wrap items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="outline" size="icon" aria-label="گزینه‌های بیشتر" />}
            >
              <MoreHorizontalIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>گزینه اول</DropdownMenuItem>
              <DropdownMenuItem>گزینه دوم</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">حذف</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Tooltip>
            <TooltipTrigger render={<Button variant="ghost" />}>روی من بایستید</TooltipTrigger>
            <TooltipContent>راهنمای کوتاه</TooltipContent>
          </Tooltip>
        </div>
      </PreviewGroup>
      <ShellExample />
      <PreviewGroup title="پنجره‌ی گفتگو، تأیید حذف و پنل کناری">
        <div className="flex flex-wrap gap-3">
          <Dialog>
            <DialogTrigger render={<Button variant="outline" />}>باز کردن پنجره</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>عنوان پنجره</DialogTitle>
                <DialogDescription>توضیح کوتاه درباره‌ی کاری که در این پنجره انجام می‌شود.</DialogDescription>
              </DialogHeader>
              <DialogFooter showCloseButton>
                <Button>تأیید</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="destructive" />}>حذف مورد</AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>این مورد حذف شود؟</AlertDialogTitle>
                <AlertDialogDescription>پس از حذف، این مورد دیگر در دسترس نخواهد بود.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction variant="destructive">حذف</AlertDialogAction>
                <AlertDialogCancel>انصراف</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Sheet>
            <SheetTrigger render={<Button variant="outline" />}>باز کردن پنل</SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>عنوان پنل</SheetTitle>
                <SheetDescription>پنل کناری از سمت شروع باز می‌شود.</SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </PreviewGroup>
    </PreviewSection>
  );
}
